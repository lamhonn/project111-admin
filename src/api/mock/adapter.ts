import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios';
import type { ProductDto } from '../../types/dtos/productDto';
import type { MenuDto } from '../../types/dtos/menuDto';
import type { TabletDto } from '../../types/dtos/tabletDto';
import type { OrganizationDto } from '../../types/dtos/organizationDto';
import type { OrderDto } from '../../types/dtos/orderDto';
import type { BillDto } from '../../types/dtos/billDto';
import type { SessionDto } from '../../types/dtos/sessionDto';
import { BillStatus } from '../../types/enums/billStatus';
import { OrderStatus } from '../../types/enums/orderStatus';
import type { Order } from '../../types/models';
import { createDemoData, demoOrganizationId, demoUserId } from './data';

const database = createDemoData();

export function createIncomingDemoOrder(sequence: number): Order | null {
    const sessions = database.sessions.filter(session => !session.endTime
        && database.tablets.some(tablet => tablet.id === session.tabletId));
    const session = sessions[sequence % sessions.length];
    const selections = sequence === 0 ? ['demo-product-4', 'demo-product-14'] : ['demo-product-10', 'demo-product-13'];
    const products = database.products.filter(product => selections.includes(product.id));
    if (!session || products.length === 0) return null;

    const tablet = findById(database.tablets, session.tabletId);
    const id = `demo-incoming-order-${sequence + 1}`;
    const created = new Date();
    const order: Order = {
        id,
        organizationId: session.organizationId,
        sessionId: session.id,
        userId: session.userId,
        tabletId: tablet.id,
        tableNumber: tablet.tableNumber,
        totalPrice: products.reduce((total, product) => total + product.price, 0),
        orderStatus: OrderStatus.RECEIVED,
        created,
        orderProducts: products.map((product, index) => ({
            id: `${id}-item-${index + 1}`,
            orderId: id,
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            orderProductToppings: [],
            orderProductExcludables: [],
            created,
        })),
    };
    database.orders.unshift(order);
    session.orders.unshift(order);
    return structuredClone(order);
}

function findById<Entity extends { id: string }>(entities: Entity[], id: string): Entity {
    const entity = entities.find(candidate => candidate.id === id);
    if (!entity) throw new Error(`Demo record not found: ${id}`);
    return entity;
}

function save<Entity extends { id: string }>(entities: Entity[], entity: Entity, create: boolean): Entity {
    if (create) {
        entities.push(entity);
    } else {
        Object.assign(findById(entities, entity.id), entity);
    }
    return entity;
}

function remove<Entity extends { id: string }>(entities: Entity[], id: string): Entity {
    const entity = findById(entities, id);
    entities.splice(entities.indexOf(entity), 1);
    return entity;
}

function handleRequest(config: InternalAxiosRequestConfig): unknown {
    const [resource, scope, id] = (config.url ?? '').split('/').filter(Boolean);
    const method = config.method?.toLowerCase() ?? 'get';
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const created = new Date();

    if (resource === 'auth') return 'demo-token';

    if (resource === 'products') {
        if (method === 'get') return scope === 'organization'
            ? database.products.filter(product => product.organizationId === id)
            : findById(database.products, scope);
        if (method === 'delete') {
            database.menus.forEach(menu => { menu.menuProducts = menu.menuProducts.filter(product => product.productId !== scope); });
            return remove(database.products, scope);
        }
        if (method === 'post' || method === 'put') {
            const dto = body as ProductDto;
            return save(database.products, {
                ...dto,
                id: dto.id || crypto.randomUUID(),
                created: method === 'put' ? findById(database.products, dto.id).created : created,
                productToppings: dto.productToppings.map(topping => ({ ...topping, created: topping.created ?? created })),
                productExcludables: dto.productExcludables.map(excludable => ({ ...excludable, created: excludable.created ?? created })),
            }, method === 'post');
        }
    }

    if (resource === 'menus') {
        if (method === 'get') return database.menus.filter(menu => menu.organizationId === id);
        if (method === 'delete') return remove(database.menus, scope);
        if (method === 'post' || method === 'put') {
            const dto = body as MenuDto;
            return save(database.menus, {
                ...dto,
                id: dto.id || crypto.randomUUID(),
                created: method === 'put' ? findById(database.menus, dto.id).created : created,
                menuCategories: dto.menuCategories.map(category => ({ ...category, created })),
                menuProducts: dto.menuProducts.map(product => ({
                    ...product,
                    product: findById(database.products, product.productId),
                    created: product.created ?? created,
                })),
            }, method === 'post');
        }
    }

    if (resource === 'tablets') {
        if (method === 'get') return scope === 'user'
            ? database.tablets.filter(tablet => tablet.userId === id)
            : findById(database.tablets, scope);
        if (method === 'delete') return remove(database.tablets, scope);
        if (method === 'post' || method === 'put') {
            const dto = body as TabletDto;
            const tablet = save(database.tablets, {
                ...dto,
                id: dto.id || crypto.randomUUID(),
                created: method === 'put' ? findById(database.tablets, dto.id).created : created,
            }, method === 'post');
            database.orders.filter(order => order.tabletId === tablet.id).forEach(order => { order.tableNumber = tablet.tableNumber; });
            return tablet;
        }
    }

    if (resource === 'organizations') {
        if (method === 'get') return findById(database.organizations, scope);
        if (method === 'put') {
            const dto = body as OrganizationDto;
            return Object.assign(findById(database.organizations, dto.id), dto);
        }
    }

    if (resource === 'orders') {
        if (method === 'get') {
            if (scope !== 'user' && scope !== 'organization') return findById(database.orders, scope);
            const status = config.params?.Status;
            return database.orders.filter(order =>
                (scope === 'user' ? order.userId === id : order.organizationId === id)
                && (status === undefined || order.orderStatus === Number(status))
            ).sort((first, second) => second.created.getTime() - first.created.getTime());
        }
        if (method === 'patch') {
            const dto = body as OrderDto;
            findById(database.orders, dto.id).orderStatus = dto.orderStatus;
            return dto;
        }
    }

    if (resource === 'sessions') {
        if (method === 'get') {
            const sessions = scope === 'user'
                ? database.sessions.filter(session => session.userId === id && (!config.params?.GetLatest || !session.endTime))
                : [findById(database.sessions, scope)];
            const hydrated = sessions.map(session => ({ ...session, orders: database.orders.filter(order => order.sessionId === session.id) }));
            return scope === 'user' ? hydrated : hydrated[0];
        }
        if (method === 'patch') {
            const dto = body as SessionDto;
            findById(database.sessions, dto.id).endTime = created;
            return dto;
        }
    }

    if (resource === 'bills') {
        if (method === 'get') return database.bills.filter(bill => bill.sessionId === scope && bill.status !== BillStatus.COMPLETED);
        if (method === 'patch') {
            const dto = body as BillDto;
            findById(database.bills, dto.id).status = dto.status;
            return dto;
        }
    }

    if (resource === 'pairing' && method === 'post') {
        if (scope === 'stop') return null;
        if (scope === 'start') return {
            id: crypto.randomUUID(),
            userId: demoUserId,
            organizationId: demoOrganizationId,
            pin: '12345678',
            expires: new Date(created.getTime() + 10 * 60000),
        };
    }

    throw new Error(`Unsupported demo endpoint: ${method} ${config.url}`);
}

export const demoAdapter: AxiosAdapter = async config => {
    try {
        return {
            data: structuredClone(handleRequest(config)),
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
        };
    } catch (error) {
        throw new AxiosError(error instanceof Error ? error.message : 'Demo request failed', 'ERR_DEMO_REQUEST', config);
    }
};