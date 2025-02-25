
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLIC_KEY = "pk_test_51QfNIBDNHPRBLU277BZVh4jiKPaxR6IoZ5lLJz3NOr5oUJqPOpWk8CWKVL5mQY92Epaww8mwfdI3MXsumCCNhrGX00xsfphexT";

export const stripe = loadStripe(STRIPE_PUBLIC_KEY);
