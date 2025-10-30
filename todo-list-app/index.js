const parent = document.querySelector("ul");
const input = document.querySelector("input");
const ID = () => Math.random().toString(36).substr(2, 9);



let todoListState = "";
let todoListItems = [
  {
    id: 1,
    title: "Dummies input",
    isChecked: false,
  },
  {
    id: 1,
    title: "Tomato",
    isChecked: true,
  },
  {
    id: 1,
    title: "Cofee",
    isChecked: true,
  },
  {
    id: 1,
    title: "Pizza",
    isChecked: false,
  },
];

const _reRenderItems = () => {
  // remove
  parent.innerHTML = "";

  // add items
  todoListItems.forEach((item) => {
    _addNewTodoItem(item.title, item.isChecked, item.id);
  });
};

const _addNewTodoItem = (title, isChecked, id) => {
  const li = document.createElement("li");

  li.innerHTML = `
<li
    
            class="group cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded-lg duration-100 ease-in flex items-center gap-2"
          >
            <div
              onclick="_removeListItemById('${id}')"
              class="w-0 group-hover:w-8 h-8 flex items-center justify-center overflow-hidden bg-red-50 rounded-lg duration-100 ease-in"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-red-400 lucide lucide-trash2-icon lucide-trash-2"
              >
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>

            <span onclick="_editExistingItemName('${id}', this.innerText)" class="flex-1 ${
              isChecked ? "line-through text-gray-400" : ""
            }">${title}</span>

            <div class="${
              isChecked ? "bg-green-400" : "bg-gray-200"
            } p-1  rounded-full">
                <svg onclick="_toggleListItem('${id}')" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="${
                  isChecked ? "text-white" : "text-gray-500"
                } lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
          </li>
  `;

  // Trigger re render
  parent.appendChild(li);
};
function _editExistingItemName(id, currentName) {
    console.log("I am here");
    const newName = prompt("Enter new name for the item:", currentName);
    if (newName === null || newName.trim() === "") {
      return; // User cancelled or entered an empty name
    }
    const newItems = todoListItems.map((item) => {
      if (item.id !== id) {
        return item;
      }

      return { ...item, title: newName };
    });
    todoListItems = newItems;

    _reRenderItems();
    console.log(todoListItems);

}
//display the list items

function _removeListItemById(id) {
  const newItems = todoListItems.filter((item) => {
    return item.id != id;
  });
  todoListItems = newItems;

  _reRenderItems();
}

function _toggleListItem(id) {
  const newItems = todoListItems.map((item) => {
    if (item.id != id) {
      return item;
    }

    return { ...item, isChecked: !item.isChecked };
  });
  todoListItems = newItems;

  _reRenderItems();
}

const _resetInputValue = () => {
  // Reset the state
  todoListState = "";

  input.value = "";
};

// Listen on input change
input.addEventListener("input", (ev) => {
  todoListState = ev.target.value;
});

input.addEventListener("input", () => {
  console.log("input changed");
  todoListItems.map((item) => {
    if (item.id === 1) {
      //don't return items with id 1
      todoListItems = todoListItems.filter((i) => i.id !== 1);
      _reRenderItems();
    }
  });
  
});
// Listen for enter
input.addEventListener("keypress", (ev) => {
  const isEnterPressed = ev.key === "Enter";

  if (isEnterPressed && todoListState.trim() !== "") {
    _addNewTodoItem(todoListState, false, ID());
    todoListItems.push({ id: ID(), title: todoListState, isChecked: false });
    _resetInputValue();
  }
});

_reRenderItems();
