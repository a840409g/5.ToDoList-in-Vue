<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link to="/todolist">
        <a class="navbar-brand">Home</a>
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link to="/">
              <a class="nav-link">
                綜覽頁
                <span class="sr-only">(current)</span>
              </a>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/todolist">
              <a class="nav-link">Todo List</a>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    <div id="main">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
* {
  box-sizing: border-box;
}
body,
html {
  padding: 0;
  margin: 0;
}
#app {
  font-family: "Baloo Bhai", cursive;
  font-family: "Source Code Pro", monospace;
}
#main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 1200px;
}
a {
  color: #22262a;
}
a:hover {
  text-decoration: none;
}
.checked {
  text-decoration: line-through !important;
  background-color: #037bff !important;
  color: #fff;
}
.selected {
  background-color: #037bff !important;
  color: #fff;
}
.lists .num,
.things,
.date {
  padding: 0 10px;
}
.todo_ul {
  width: 80%;
  height: 70%;
  overflow: scroll;
}
ul li:nth-child(even) {
  background-color: #bee5eb;
}
.lists {
  width: 100%;
}
.fas,
.fa-pen {
  font-family: "Font Awesome 5 Free";
  font-size: 12px;
}
.parts {
  display: flex;
  position: absolute;
  right: 10px;
  top: 25%;
}

</style>
