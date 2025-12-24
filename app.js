const text_label = document.querySelector("#label");
const optionContainer = document.querySelector("#option_container");

let gamestats = { current_state: "start" };

fetch("/data/test.lvl")
  .then((res) => res.text())
  .then((data) => {
    const level = JSON.parse(data);
    console.log(level);
    run_node(level);
  })
  .catch((e) => console.error(e));

function parseText(text, gamestats) {
  return text.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    return gamestats[key] ?? "";
  });
}

function run_node(level) {
  optionContainer.replaceChildren();

  const node = level[gamestats.current_state];

  text_label.textContent = parseText(node.text, gamestats);

  if (node.options) {
    Object.entries(node.options).forEach(([text, next_state]) => {
      const optionElement = document.createElement("button");
      optionElement.classList.add("option");
      optionElement.textContent = text;
      optionElement.onclick = () => {
        gamestats.current_state = String(next_state);
        run_node(level);
      };
      optionContainer.appendChild(optionElement);
    });
  } else if (node.input) {
    const inputElement = document.createElement("input");
    const submitBtn = document.createElement("button");

    inputElement.placeholder = node.input.placeholder;
    submitBtn.textContent = "Submit";

    submitBtn.onclick = () => {
      gamestats[node.input.var] = inputElement.value;
      gamestats.current_state = node.input.next;
      run_node(level);
    };

    optionContainer.appendChild(inputElement);
    optionContainer.appendChild(submitBtn);
  }
}
