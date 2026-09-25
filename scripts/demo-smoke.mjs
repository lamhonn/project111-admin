import assert from 'node:assert/strict';
import { mock } from 'node:test';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom' });

try {
    const { api } = await server.ssrLoadModule('/src/api/axios.ts');
    const auth = await server.ssrLoadModule('/src/state/authStore.ts');
    const { store } = await server.ssrLoadModule('/src/state/store.ts');
    const orderState = await server.ssrLoadModule('/src/state/orderStore.ts');
    const sessionState = await server.ssrLoadModule('/src/state/sessionStore.ts');
    const { OrderStatus } = await server.ssrLoadModule('/src/types/enums/orderStatus.ts');
    const { BillStatus } = await server.ssrLoadModule('/src/types/enums/billStatus.ts');

    store.set(auth.tokenAtom, null);
    assert.equal(store.get(auth.isAuthenticatedAtom), true);
    assert.equal(store.get(auth.organizationIdAtom), 'demo-organization');
    assert.equal(store.get(auth.userIdAtom), 'demo-user');
    await store.set(auth.logoutAtom);
    assert.equal(store.get(auth.isAuthorizedAtom), true);

    const { data: products } = await api.get('/products/organization/demo-organization');
    assert.equal(products.length, 14);
    assert.ok(products[0].created instanceof Date);
    for (const product of products) {
        for (const language of ['en', 'fi', 'sv']) assert.ok(JSON.parse(product.name)[language]);
    }
    const { data: menus } = await api.get('/menus/organization/demo-organization');
    assert.equal(menus[0].menuProducts.length, products.length);
    for (const category of menus[0].menuCategories) assert.ok(JSON.parse(category.name).en);

    products[0].price = 999;
    assert.equal((await api.get(`/products/${products[0].id}`)).data.price, 14.5);
    const newProduct = { ...products[1], id: 'smoke-product', price: 18 };
    await api.post('/products', newProduct);
    await api.put('/products', { ...newProduct, price: 19 });
    assert.equal((await api.get('/products/smoke-product')).data.price, 19);
    await api.delete('/products/smoke-product');
    await assert.rejects(api.get('/products/smoke-product'));

    const newMenu = { ...menus[0], id: 'smoke-menu', enabled: false };
    await api.post('/menus', newMenu);
    await api.put('/menus', { ...newMenu, name: 'Updated menu' });
    assert.equal((await api.get('/menus/organization/demo-organization')).data.find(menu => menu.id === newMenu.id).name, 'Updated menu');
    await api.delete('/menus/smoke-menu');

    await store.set(orderState.getNewOrdersAtom);
    assert.equal(store.get(orderState.getNewOrdersAtom).length, 2);
    assert.equal(store.get(orderState.preparingOrdersAtom).length, 1);
    store.set(orderState.selectedOrderIdAtom, 'demo-order-1');
    await store.set(orderState.updateOrderStatusAtom, 'demo-order-1', OrderStatus.PREPARING);
    assert.equal(store.get(orderState.preparingOrdersAtom).length, 2);
    assert.equal(store.get(orderState.preparingOrdersAtom)[0].id, 'demo-order-1');
    assert.equal((await api.get('/orders/demo-order-1')).data.orderStatus, OrderStatus.PREPARING);
    await store.set(orderState.updateOrderStatusAtom, 'demo-order-1', OrderStatus.COMPLETED);
    assert.equal(store.get(orderState.preparingOrdersAtom).length, 1);
    const { data: completed } = await api.get('/orders/user/demo-user', { params: { Status: OrderStatus.COMPLETED } });
    assert.equal(completed.length, 3);

    await store.set(sessionState.getLatestSessionsAtom);
    assert.equal(store.get(sessionState.currentSessionsAtom).length, 4);
    await store.set(sessionState.setEndSessionAtom, 'demo-session-1');
    assert.equal(store.get(sessionState.currentSessionsAtom).length, 3);
    assert.ok((await api.get('/sessions/demo-session-1')).data.endTime instanceof Date);
    assert.equal((await api.get('/sessions/user/demo-user', { params: { GetLatest: true } })).data.length, 3);

    const { data: bills } = await api.get('/bills/demo-session-4');
    assert.equal(bills.length, 1);
    await api.patch('/bills', { ...bills[0], status: BillStatus.COMPLETED });
    assert.equal((await api.get('/bills/demo-session-4')).data.length, 0);

    assert.equal((await api.get('/tablets/user/demo-user')).data.length, 8);
    await api.post('/tablets', { id: 'smoke-tablet', userId: 'demo-user', tableNumber: 9 });
    await api.put('/tablets', { id: 'smoke-tablet', userId: 'demo-user', tableNumber: 10 });
    assert.equal((await api.get('/tablets/smoke-tablet')).data.tableNumber, 10);
    await api.delete('/tablets/smoke-tablet');
    const { data: organization } = await api.get('/organizations/demo-organization');
    await api.put('/organizations', { ...organization, name: 'Updated Diner' });
    assert.equal((await api.get('/organizations/demo-organization')).data.name, 'Updated Diner');
    const { data: pairing } = await api.post('/pairing/start');
    assert.equal(pairing.pin, '12345678');
    assert.ok(pairing.expires > new Date());
    await api.post(`/pairing/stop/${pairing.id}`);
    await assert.rejects(api.get('/unsupported'));

    const { OrderWebSocket } = await server.ssrLoadModule('/src/api/websocket/orderSocket.ts');
    mock.timers.enable({ apis: ['setTimeout', 'Date'], now: Date.now() });
    const arrivals = [];
    const subscribe = () => OrderWebSocket.subscribeToOrdersCreated('demo-user', payload => arrivals.push(payload));
    const stopInitial = subscribe();
    stopInitial();
    const stop = subscribe();
    mock.timers.tick(5999);
    assert.equal(arrivals.length, 0);
    mock.timers.tick(1);
    assert.equal(arrivals.length, 1);
    const incoming = (await api.get(`/orders/${arrivals[0].orderId}`)).data;
    assert.equal(incoming.orderStatus, OrderStatus.RECEIVED);
    assert.equal(incoming.orderProducts.length, 2);
    assert.equal(incoming.totalPrice, incoming.orderProducts.reduce((total, product) => total + product.productPrice, 0));
    assert.ok((await api.get(`/sessions/${incoming.sessionId}`)).data.orders.some(order => order.id === incoming.id));
    await store.set(orderState.getNewOrdersAtom);
    assert.equal(store.get(orderState.getNewOrdersAtom)[0].id, incoming.id);
    stop();
    mock.timers.tick(20000);
    assert.equal(arrivals.length, 1);
    const stopResumed = subscribe();
    mock.timers.tick(9999);
    assert.equal(arrivals.length, 1);
    mock.timers.tick(1);
    assert.equal(arrivals.length, 2);
    assert.notEqual(arrivals[0].orderId, arrivals[1].orderId);
    await store.set(orderState.getNewOrdersAtom);
    assert.equal(store.get(orderState.getNewOrdersAtom)[0].id, arrivals[1].orderId);
    for (const endpoint of ['/orders/user/demo-user', '/orders/organization/demo-organization']) {
        const { data: orders } = await api.get(endpoint);
        assert.equal(orders[0].id, arrivals[1].orderId);
        assert.deepEqual(orders.map(order => order.created.getTime()), orders.map(order => order.created.getTime()).sort((first, second) => second - first));
    }
    stopResumed();
    const stopFinished = subscribe();
    mock.timers.tick(60000);
    assert.equal(arrivals.length, 2);
    stopFinished();
    mock.timers.reset();
    console.log('Delayed order checks passed: timing, two-order limit, cleanup, resubscription and session consistency.');
    console.log('Demo smoke checks passed: authentication, fixtures, CRUD, order transitions, sessions, bills and pairing.');
} finally {
    mock.timers.reset();
    await server.close();
}