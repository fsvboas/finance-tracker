"use client";

import Column from "@/src/components/utils/column";
import UpdatePasswordForm from "./update-password-form";
import UpdateUserInfosForm from "./update-user-infos-form";
import UserDataSection from "./user-data-section";

const MyAccountSections = () => {
  return (
    <Column className="space-y-4 items-center w-full justify-center h-fit sm:max-w-5xl mx-auto lg:py-4 mt-16 mb-22">
      <UpdateUserInfosForm />
      <UpdatePasswordForm />
      <UserDataSection />
    </Column>
  );
};

export default MyAccountSections;
