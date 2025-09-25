export class CustomAlert {
  constructor() {
    this.createAlertElement();
  }

  createAlertElement() {
    this.alertEl = document.createElement("div");
    this.alertEl.id = "custom-alert";
    this.alertEl.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.4);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `;

    const box = document.createElement("div");
    box.className = "custom-alert-box";
    box.style.cssText = `
      background: white;
      border-radius: 10px;
      padding: 10px 0 25px 0;
      text-align: center;
      min-width: 280px;
      max-width: 90%;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
    `;

    const header = document.createElement("div");
    header.className = "custom-alert-header";
    header.style.cssText = `
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: bold;
      color: #333;
    `;

    const icon = document.createElement("span");
    icon.textContent = "🔔";
    icon.style.cssText = `
      font-size: 18px;
      margin-right: 5px;
    `;

    const title = document.createElement("span");
    title.textContent = "알림";

    const divider = document.createElement("hr");
    divider.style.cssText = `
      width: 100%;
      margin: 10px 0;
      border: none;
      border-top: 1px solid #ccc;
    `;

    const message = document.createElement("p");
    message.id = "alert-message";
    message.style.cssText = `
      font-size: 18px;
      margin-bottom: 20px;
      padding: 10px;
    `;
    this.messageEl = message;

    const btn = document.createElement("button");
    btn.textContent = "확인";
    btn.style.cssText = `
      padding: 10px 20px;
      background-color: #7F6AEE;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
    `;

    btn.onclick = () => {
      this.hide();
      if (this.onConfirm) this.onConfirm();  
    };

    header.appendChild(icon);
    header.appendChild(title);
    box.append(header, divider, message, btn);
    this.alertEl.append(box);
    document.body.appendChild(this.alertEl);
  }

  show(message, onConfirm = null) {
    this.messageEl.textContent = message;
    this.alertEl.style.display = "flex";
    this.onConfirm = onConfirm; 
  }

  hide() {
    this.alertEl.style.display = "none";
  }
}
