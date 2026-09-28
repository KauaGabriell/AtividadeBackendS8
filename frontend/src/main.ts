import { ApiError, apiRequest, type PublicUser } from "./api";

const page = document.body.dataset.page;

function showMessage(message: string, isError = true): void {
  const element = document.querySelector<HTMLElement>("#form-message");
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("is-error", isError);
  element.classList.toggle("is-success", !isError);
}

function getFormValues(form: HTMLFormElement): Record<string, string> {
  return Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
}

function setSubmitting(form: HTMLFormElement, isSubmitting: boolean, defaultLabel: string): void {
  const button = form.querySelector<HTMLButtonElement>("button[type='submit']");
  if (!button) return;

  button.disabled = isSubmitting;
  button.innerHTML = isSubmitting ? "Aguarde..." : `${defaultLabel} <span aria-hidden="true">→</span>`;
}

async function handleRegister(): Promise<void> {
  const form = document.querySelector<HTMLFormElement>("#register-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("");

    if (!form.reportValidity()) return;
    setSubmitting(form, true, "Criar conta");

    try {
      const user = await apiRequest<PublicUser>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(getFormValues(form)),
      });
      showMessage(`Conta criada para ${user.name}. Redirecionando para o login...`, false);
      window.setTimeout(() => window.location.assign("/"), 900);
    } catch (error) {
      showMessage(error instanceof ApiError ? error.message : "Erro inesperado. Tente novamente.");
    } finally {
      setSubmitting(form, false, "Criar conta");
    }
  });
}

async function handleLogin(): Promise<void> {
  const form = document.querySelector<HTMLFormElement>("#login-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("");

    if (!form.reportValidity()) return;
    setSubmitting(form, true, "Entrar");

    try {
      await apiRequest<PublicUser>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(getFormValues(form)),
      });
      window.location.assign("/dashboard.html");
    } catch (error) {
      showMessage(error instanceof ApiError ? error.message : "Erro inesperado. Tente novamente.");
    } finally {
      setSubmitting(form, false, "Entrar");
    }
  });
}

async function loadDashboard(): Promise<void> {
  const nameElement = document.querySelector<HTMLElement>("#user-name");
  const emailElement = document.querySelector<HTMLElement>("#user-email");
  if (!nameElement || !emailElement) return;

  try {
    const user = await apiRequest<PublicUser>("/api/me");
    nameElement.textContent = user.name;
    emailElement.textContent = user.email;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      window.location.replace("/");
      return;
    }

    nameElement.textContent = "";
    emailElement.textContent = "";
    showMessage(error instanceof ApiError ? error.message : "Erro inesperado. Tente novamente.");
  }
}

if (page === "register") void handleRegister();
if (page === "login") void handleLogin();
if (page === "dashboard") void loadDashboard();
