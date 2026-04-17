import type { Profile, ContactInformation, SocialNetwork } from "@/types/cv.types";
import { apiFetch } from "./base.service";

export async function getProfile(): Promise<Profile> {
  return apiFetch<Profile>("/profile");
}

export async function getContactInfo(): Promise<ContactInformation> {
  return apiFetch<ContactInformation>("/contact-info");
}

export async function getSocialNetworks(): Promise<SocialNetwork[]> {
  return apiFetch<SocialNetwork[]>("/social-networks");
}
