import type { Component } from "vue";

export enum MainSection {
  ORGANIZATIONS = "organizations",
  THREADS = "threads",
  DEADLINES = "deadlines",
  INVITATIONS = "invitations",
}

export type NavigationButtonConfig = {
  section: MainSection;
  icon: Component;
};
