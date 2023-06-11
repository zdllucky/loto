import Alpine from "alpinejs";

Alpine.data("authForm", () => ({
  login: "",
  password: "",
  isLoading: false,
  form: {
    async "@submit.prevent"(event) {
      this.isLoading = true;

      const res = await Alpine.store("auth")[event.submitter.value](
        this.login,
        this.password
      );

      if (!res.ok) {
        this.isLoading = false;
        alert(res);
      }
    },
  },
}));
