const textarea = document.getElementById("code");
const output = document.getElementById("output");

const compile = async () => {
  const lang = document.getElementById("language").value;

  output.innerText = "Compiling...";

  try {
    const response = await fetch(`${window.location.href}api/${lang}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: textarea.value }),
    });

    const data = await response.json();
    output.innerText = data?.out ?? "No output received.";
  } catch (error) {
    output.innerText = `Error: ${error.message}`;
  }
};
