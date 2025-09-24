import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { OrderModuleItemsModule } from './order-module-items/order-module-items.module';
import { ProdModulesModule } from './prod-modules/prod-modules.module';
import { HelpdeskModule } from './helpdesk/helpdesk.module';
import { EventsModule } from './events/events.module';
import { LoyaltyRewardsModule } from './loyalty-rewards/loyalty-rewards.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UserModule } from './user/user.module';
import { VendorsModule } from './vendors/vendors.module';
import { VisitsModule } from './visits/visits.module';
import { ShippingZonesModule } from './shipping-zones/shipping-zones.module';
import { CatalogModule } from './catalog/catalog.module';
import { CreditRequestsModule } from './credit-requests/credit-requests.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { RegistrationRequestsModule } from './registration-requests/registration-requests.module';
import { WishlistItemsModule } from './wishlist-items/wishlist-items.module';
import { SalesAnalyticsModule } from './sales-analytics/sales-analytics.module';
import { SalesCustomersModule } from './sales-customers/sales-customers.module';
import { SalesEventsModule } from './sales-events/sales-events.module';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [
    ProductsModule,
    OrdersModule,
    OrderItemsModule,
    OrderModuleItemsModule,
    ProdModulesModule,
    HelpdeskModule,
    EventsModule,
    LoyaltyRewardsModule,
    LoyaltyModule,
    AuthModule,
    ClientsModule,
    DashboardModule,
    UserModule,
    VendorsModule,
    VisitsModule,
    ShippingZonesModule,
    CatalogModule,
    CreditRequestsModule,
    WishlistModule,
              RegistrationRequestsModule,
          WishlistItemsModule,
          SalesAnalyticsModule,
          SalesCustomersModule,
          SalesEventsModule,
          AddressesModule,
  ],
})
export class ClubModule {}
