import type { Menu, Order, Organization, Product, Session, Tablet } from '../../types/models';
import type { Bill } from '../../types/models/bill';
import { Dietary } from '../../types/enums';
import { OrderStatus } from '../../types/enums/orderStatus';
import { BillStatus } from '../../types/enums/billStatus';

export const demoOrganizationId = 'demo-organization';
export const demoUserId = 'demo-user';

const translated = (name: string, finnish: string = name) => JSON.stringify({ en: name, fi: finnish, sv: name });

export function createDemoData() {
    const created = new Date();
    const minutesAgo = (minutes: number) => new Date(created.getTime() - minutes * 60000);
    const dishes: { name: string; finnish: string; price: number; description: string; ingredients: string; dietaries?: Dietary[] }[] = [
        { name: 'Classic Cheeseburger', finnish: 'Juustohampurilainen', price: 14.5, description: 'Grilled beef patty with cheddar and house sauce, served with fries.', ingredients: 'Beef, wheat bun, cheddar, lettuce, tomato, onion, pickles, mayonnaise, potatoes' },
        { name: 'Bacon BBQ Burger', finnish: 'Pekoni-BBQ-hampurilainen', price: 16.5, description: 'Smoky bacon, beef and cheddar with BBQ sauce and fries.', ingredients: 'Beef, wheat bun, bacon, cheddar, onion, BBQ sauce, potatoes' },
        { name: 'Veggie Burger', finnish: 'Kasvishampurilainen', price: 14, description: 'Chickpea patty with crisp salad and vegan mayonnaise, served with fries.', ingredients: 'Chickpeas, wheat bun, lettuce, tomato, vegan mayonnaise, potatoes', dietaries: [Dietary.Vegan, Dietary.LactoseFree] },
        { name: 'Grilled Chicken Sandwich', finnish: 'Kanavoileipa', price: 13.5, description: 'Grilled chicken on toasted sourdough with herb mayonnaise.', ingredients: 'Chicken, wheat sourdough, lettuce, tomato, mayonnaise' },
        { name: 'Buttermilk Pancakes', finnish: 'Pannukakut', price: 9.5, description: 'Three fluffy pancakes with maple syrup and berries.', ingredients: 'Wheat flour, buttermilk, eggs, butter, maple syrup, berries', dietaries: [Dietary.Vegetarian] },
        { name: 'All-Day Breakfast', finnish: 'Koko paivan aamiainen', price: 12.5, description: 'Two eggs, bacon, hash browns and toast.', ingredients: 'Eggs, bacon, potatoes, wheat bread, butter' },
        { name: 'Garden Salad', finnish: 'Vihersalaatti', price: 10.5, description: 'Fresh greens with cherry tomatoes, cucumber and lemon dressing.', ingredients: 'Lettuce, tomato, cucumber, olive oil, lemon', dietaries: [Dietary.Vegan, Dietary.GlutenFree, Dietary.LactoseFree] },
        { name: 'French Fries', finnish: 'Ranskalaiset', price: 4.5, description: 'Golden fries with sea salt.', ingredients: 'Potatoes, vegetable oil, sea salt', dietaries: [Dietary.Vegan, Dietary.GlutenFree, Dietary.LactoseFree] },
        { name: 'Onion Rings', finnish: 'Sipulirenkaat', price: 5.5, description: 'Crispy battered onion rings with house dip.', ingredients: 'Onion, wheat flour, milk, mayonnaise', dietaries: [Dietary.Vegetarian] },
        { name: 'Apple Pie', finnish: 'Omenapiirakka', price: 6.5, description: 'Warm apple pie with vanilla ice cream.', ingredients: 'Apple, wheat flour, butter, cinnamon, sugar, milk, cream', dietaries: [Dietary.Vegetarian] },
        { name: 'Chocolate Brownie', finnish: 'Suklaabrownie', price: 6, description: 'Rich chocolate brownie with whipped cream.', ingredients: 'Chocolate, wheat flour, butter, eggs, sugar, cream', dietaries: [Dietary.Vegetarian] },
        { name: 'Vanilla Milkshake', finnish: 'Vaniljapirtelo', price: 6.5, description: 'Classic vanilla ice cream milkshake.', ingredients: 'Milk, vanilla ice cream, cream', dietaries: [Dietary.Vegetarian, Dietary.GlutenFree] },
        { name: 'Filter Coffee', finnish: 'Suodatinkahvi', price: 3, description: 'Freshly brewed house coffee.', ingredients: 'Coffee, water', dietaries: [Dietary.Vegan, Dietary.GlutenFree, Dietary.LactoseFree] },
        { name: 'Homemade Lemonade', finnish: 'Talon limonadi', price: 4, description: 'Fresh lemon juice with sparkling water.', ingredients: 'Lemon, sparkling water, sugar', dietaries: [Dietary.Vegan, Dietary.GlutenFree, Dietary.LactoseFree] },
    ];

    const products: Product[] = dishes.map((dish, index) => {
        const id = `demo-product-${index + 1}`;
        return {
            id,
            organizationId: demoOrganizationId,
            name: translated(dish.name, dish.finnish),
            description: translated(dish.description),
            ingredients: translated(dish.ingredients),
            price: dish.price,
            dietaries: dish.dietaries ?? [],
            freeToppings: 0,
            productToppings: index < 2 ? [
                { id: `${id}-cheese`, productId: id, name: translated('Extra cheddar', 'Lisajuusto'), price: 1.5, created },
                { id: `${id}-bacon`, productId: id, name: translated('Extra bacon', 'Lisapekoni'), price: 2, created },
            ] : [],
            productExcludables: index < 3 ? [
                { id: `${id}-onion`, productId: id, name: translated('Onion', 'Sipuli'), created },
                { id: `${id}-sauce`, productId: id, name: translated('Sauce', 'Kastike'), created },
            ] : [],
            created,
        };
    });

    const menuId = 'demo-menu';
    const categoryNames = ['Burgers & Sandwiches', 'All-Day Breakfast', 'Salads & Sides', 'Desserts', 'Drinks'];
    const menuCategories = categoryNames.map((name, index) => ({ id: `demo-category-${index}`, menuId, name: translated(name), created }));
    const menus: Menu[] = [{
        id: menuId,
        organizationId: demoOrganizationId,
        enabled: true,
        name: 'Main Street Diner',
        patternStartTime: null,
        patternEndTime: null,
        eventStartTime: null,
        eventEndTime: null,
        menuCategories,
        menuProducts: products.map((product, index) => {
            const categoryIndex = index < 4 ? 0 : index < 6 ? 1 : index < 9 ? 2 : index < 11 ? 3 : 4;
            return {
                id: `demo-menu-product-${index + 1}`,
                menuId,
                productId: product.id,
                product,
                menuCategoryId: menuCategories[categoryIndex].id,
                menuCategory: menuCategories[categoryIndex],
                name: product.name,
                price: product.price,
                created,
            };
        }),
        created,
    }];

    const tablets: Tablet[] = Array.from({ length: 8 }, (_, index) => ({
        id: `demo-tablet-${index + 1}`,
        userId: demoUserId,
        tableNumber: index + 1,
        created,
    }));
    const sessions: Session[] = tablets.slice(0, 5).map((tablet, index) => ({
        id: `demo-session-${index + 1}`,
        organizationId: demoOrganizationId,
        userId: demoUserId,
        user: null,
        tabletId: tablet.id,
        startTime: minutesAgo(index === 4 ? 150 : 12 + index * 15),
        endTime: index === 4 ? minutesAgo(90) : null,
        orders: [],
    }));
    const selections = [[0, 7, 13], [2, 6, 12], [1, 3, 11], [4, 5, 12], [9, 10, 12]];
    const statuses = [OrderStatus.RECEIVED, OrderStatus.RECEIVED, OrderStatus.PREPARING, OrderStatus.COMPLETED, OrderStatus.COMPLETED];
    const orders: Order[] = sessions.map((session, index) => {
        const orderId = `demo-order-${index + 1}`;
        const orderCreated = minutesAgo(index === 4 ? 130 : 3 + index * 10);
        const orderProducts = selections[index].map((productIndex, itemIndex) => {
            const product = products[productIndex];
            const id = `${orderId}-item-${itemIndex + 1}`;
            return {
                id,
                orderId,
                productId: product.id,
                productName: product.name,
                productPrice: product.price,
                orderProductToppings: productIndex === 0 ? [{ id: `${id}-topping`, orderProductId: id, productToppingId: product.productToppings[0].id, productTopping: product.productToppings[0], created: orderCreated }] : [],
                orderProductExcludables: productIndex === 0 ? [{ id: `${id}-excludable`, orderProductId: id, productExcludableId: product.productExcludables[0].id, productExcludable: product.productExcludables[0], created: orderCreated }] : [],
                created: orderCreated,
            };
        });
        return {
            id: orderId,
            organizationId: demoOrganizationId,
            sessionId: session.id,
            userId: demoUserId,
            tabletId: session.tabletId,
            tableNumber: index + 1,
            totalPrice: orderProducts.reduce((total, product) => total + product.productPrice + product.orderProductToppings.reduce((extra, topping) => extra + topping.productTopping.price, 0), 0),
            orderProducts,
            orderStatus: statuses[index],
            created: orderCreated,
        };
    });
    sessions.forEach(session => { session.orders = orders.filter(order => order.sessionId === session.id); });
    const bills: Bill[] = orders.slice(3).map((order, index) => ({
        id: `demo-bill-${index + 1}`,
        sessionId: order.sessionId,
        tabletId: order.tabletId,
        name: `Table ${order.tableNumber}`,
        status: index === 0 ? BillStatus.REQUESTED : BillStatus.COMPLETED,
        totalPrice: order.totalPrice,
        orderProducts: order.orderProducts,
        created: minutesAgo(index === 0 ? 2 : 90),
    }));
    const organizations: Organization[] = [{
        id: demoOrganizationId,
        licenseId: null,
        license: null,
        users: [],
        primaryUserId: demoUserId,
        primaryUser: null,
        name: 'Main Street Diner',
        maxUsers: 10,
        created,
    }];

    return { products, menus, tablets, sessions, orders, bills, organizations };
}