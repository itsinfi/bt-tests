import Stripe from "stripe";
import { ORDER_PAYLOAD_MOCK, STRIPE_SK_MOCK, STRIPE_WHSEC_MOCK } from "./data/stripe-mocks";
import { ORDER_IDS } from "./data/order-ids";

const stripeConfig: Stripe.StripeConfig = { apiVersion: '2024-04-10' } as unknown as Stripe.StripeConfig;
const stripeClient = new Stripe(STRIPE_SK_MOCK, stripeConfig);

const data = [];

let limit = 50;
let i = 0;

for (const orderId of ORDER_IDS) {
    console.log(orderId)
    const payload = JSON.stringify(ORDER_PAYLOAD_MOCK(orderId));

    const header = await stripeClient.webhooks.generateTestHeaderStringAsync({
        payload: payload,
        secret: STRIPE_WHSEC_MOCK,
    });

    data.push({ header, payload });
    
    if (i >= limit) {
        break;
    }
    i++;
}

await Bun.write('src/data/stripe-data.ts', `export const STRIPE_DATA: { header: string, payload: string }[] = [${data.map((e: { header: string, payload: string }) => `{header: '${e.header}', payload: '${e.payload}'}`).toString()}];`);