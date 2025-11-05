type Callback = () => void;

class LogoutModalController {
  private showCallback: ((show: boolean) => void) | null = null;

  register(callback: (show: boolean) => void) {
    this.showCallback = callback;
  }

  open() {
    this.showCallback?.(true);
  }

  close() {
    this.showCallback?.(false);
  }
}

export const logoutModal = new LogoutModalController();
