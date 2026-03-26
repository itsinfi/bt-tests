export const STRIPE_SK_MOCK = 'sk_test_123';
export const STRIPE_PK_MOCK = 'pk_test_123';
export const STRIPE_WHSEC_MOCK = 'whsec_test_123';

export const STRIPE_EVENT_ID_MOCK = 'evt_Uakgb_J5m9g-0JDMbcJqLUak';
export const STRIPE_CS_ID_MOCK = 'cs_test_Uakgb_J5m9g-0JDMbcJqLUak';
export const STRIPE_PI_ID_MOCK = 'pi_Uakgb_J5m9g-0JDMbcJqLUakgb_J5m9g';
export const STRIPE_PMC_ID_MOCK = 'pmc_1RSvtWIPuqr1RKDoe30F6599';

export const ORDER_PAYLOAD_MOCK = (orderId: string) => ({
  id: STRIPE_EVENT_ID_MOCK,
  object: 'event',
  api_version: '2025-04-30.basil',
  created: 1758719712,
  data: {
    object: {
      id: STRIPE_CS_ID_MOCK,
      object: 'checkout.session',
      adaptive_pricing: {
        enabled: true,
      },
      after_expiration: null,
      allow_promotion_codes: null,
      amount_subtotal: 230,
      amount_total: 230,
      automatic_tax: {
        enabled: false,
        liability: null,
        provider: null,
        status: null,
      },
      billing_address_collection: null,
      branding_settings: {
        background_color: '#ffffff',
        border_style: 'rounded',
        button_color: '#e04dd9',
        display_name: 'Test',
        font_family: 'default',
        icon: null,
        logo: null,
      },
      cancel_url: 'https://localhost/payment-cancel',
      client_reference_id: null,
      client_secret: null,
      collected_information: {
        business_name: null,
        individual_name: null,
        shipping_details: null,
      },
      consent: null,
      consent_collection: null,
      created: 1758719541,
      currency: 'eur',
      currency_conversion: null,
      custom_fields: [],
      custom_text: {
        after_submit: null,
        shipping_address: null,
        submit: null,
        terms_of_service_acceptance: null,
      },
      customer: null,
      customer_creation: 'if_required',
      customer_details: {
        address: {
          city: null,
          country: 'DE',
          line1: null,
          line2: null,
          postal_code: null,
          state: null,
        },
        business_name: null,
        email: 'someone@example.com',
        individual_name: null,
        name: 'USER NAME',
        phone: null,
        tax_exempt: 'none',
        tax_ids: [],
      },
      customer_email: 'someone@example.com',
      discounts: [],
      expires_at: 1758805940,
      invoice: null,
      invoice_creation: {
        enabled: false,
        invoice_data: {
          account_tax_ids: null,
          custom_fields: null,
          description: null,
          footer: null,
          issuer: null,
          metadata: {},
          rendering_options: null,
        },
      },
      livemode: false,
      locale: null,
      metadata: {
        customerName: 'Firstname Lastname',
        type: 'order',
        orderId: orderId,
      },
      mode: 'payment',
      origin_context: null,
      payment_intent: STRIPE_PI_ID_MOCK,
      payment_link: null,
      payment_method_collection: 'if_required',
      payment_method_configuration_details: {
        id: STRIPE_PMC_ID_MOCK,
        parent: null,
      },
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
      payment_method_types: ['card', 'klarna', 'link', 'paypal'],
      payment_status: 'unpaid',
      permissions: null,
      phone_number_collection: {
        enabled: false,
      },
      recovered_from: null,
      saved_payment_method_options: null,
      setup_intent: null,
      shipping_address_collection: null,
      shipping_cost: null,
      shipping_options: [],
      status: 'complete',
      submit_type: null,
      subscription: null,
      success_url:
        'https://localhost/successful?session_id={CHECKOUT_SESSION_ID}&eventId=68d2c89317a584d7641af09e&redirectTo=SINGLE',
      total_details: {
        amount_discount: 0,
        amount_shipping: 0,
        amount_tax: 0,
      },
      ui_mode: 'hosted',
      url: null,
      wallet_options: null,
    },
  },
  livemode: false,
  pending_webhooks: 3,
  request: {
    id: null,
    idempotency_key: null,
  },
  type: 'checkout.session.completed',
});