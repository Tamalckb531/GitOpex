alert("Hello");
export const addGitOpexButton = (): void => {
  if (document.getElementById("gitOpexBtn")) return;

  const target = document.querySelector("header") || document.body;

  const btn = document.createElement("button");

  btn.id = "gitOpexBtn";
  btn.innerText = "GitOpex";
  btn.style.cssText = `
    padding: 6px 12px;
    margin-left: 10px;
    background: #2ea44f;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
  `;

  btn.onclick = () => {
    alert("GitOpex activated!");
  };

  target.appendChild(btn);
};

addGitOpexButton();
