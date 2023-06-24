import {
  NavigationContainer,
  NavItem,
  ListNavItems,
} from "@keystone-6/core/admin-ui/components";
import type { NavigationProps } from "@keystone-6/core/admin-ui/components";
import React from "react";
const Navigation = ({ authenticatedItem, lists }: NavigationProps) => (
  <NavigationContainer authenticatedItem={authenticatedItem}>
    <NavItem href="/">Dashboard</NavItem>
    <NavItem href="/queues">Broker</NavItem>
    <ListNavItems lists={lists} />
  </NavigationContainer>
);
export default Navigation;
