<template>
  <div id="todo">
    <h1>To Do List</h1>
    <input
      @keyup.enter="getTodos(newTodo)"
      type="text"
      class="getTodo form-control"
      placeholder="請輸入待辦事項..."
      v-model="newTodo"
    >
    <div class="tools">
      <input
        @keyup="filter()"
        type="text"
        placeholder="過濾器..."
        class="filter form-control"
        v-model="filterText"
      >
      <div @click="clear()" class="clear">X</div>
      <button @click="dltBtn(todos)" class="dltBtn btn btn-danger">刪除已完成</button>
      <button
        class="btn btn-primary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >展開工具列</button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a
          v-for="list in toolsList"
          @click.prevent="arrange($event)"
          :data-st="list.st"
          :class="{ selected: list.selected}"
          class="dropdown-item"
          href="#"
        >{{list.text}}</a>
      </div>
    </div>
    <div class="showBox">
      <label v-for="list in showList" :for="list.id">
        <input
          type="radio"
          name="options"
          :id="list.id"
          :value="list.condition"
          v-model="condition"
        >
        顯示{{list.text}}
      </label>
      <input @click="reset()" type="button" name="options" class="reset btn btn-info" value="reset">
    </div>
    <ul class="todo_ul list-group">
      <li
        v-for="(todo,id) in showTodo"
        @click.self="todo.completed = !todo.completed,saveData()"
        :class="todo.completed ? 'checked':'none'"
        class="lists list-group-item"
        v-show="condition == 0 || (condition == 1 && todo.completed == true)||(condition == 2 && todo.completed == false)"
      >
        <div class="checkbox">
          <input
            v-if="todo.completed == false"
            class="fas fa-pen"
            type="checkbox"
            v-model="todo.editable"
          >
        </div>
        <!-- checkbox可以改變該行editable的狀態,確保其他行的不會有變動造成全部的input都跑出來 -->
        <span class="num">{{id+1}}.</span>
        <span v-if="todo.editable == false" class="things">{{todo.content}}</span>
        <input @keyup.enter="update(todo)" v-else class="things" type="text" v-model="todo.content">
        <!-- 用v-if去控制元件顯示與否 -->
        <!-- input這邊用v-model綁定content來達到同步修改的目的,再利用updata來更新內容以及將狀態改變並隱藏input -->
        <span class="parts">
          <span
            v-if="todo.isEdit == true"
            class="editTime"
          >edited at {{getTime.editTime(todo.editTime)}}</span>
          <span class="date">{{getTime.createTime(todo.createTime)}}</span>
          <!-- 用todo的時間戳來創建時間,解決時區問題。 -->
          <!-- 因為轉換步驟是在渲染階段所以可以依照每台電腦的時區去做轉換。 -->
          <a class="dlt" href="#" @click.prevent="removeTodo(id)">
            <div class="left"></div>
            <div class="right"></div>
          </a>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "todolist",
  data() {
    return {
      todos: JSON.parse(localStorage.getItem("todolist")) || [],
      newTodo: "",
      filterText: "",
      condition: 0,
      toolsList: [
        {
          st: "recentCreateTime",
          text: "依建立時間(近到遠)",
          selected: false
        },
        {
          st: "pastCreateTime",
          text: "依建立時間(遠到近)",
          selected: false
        },
        {
          st: "editTime",
          text: "最後編輯排序",
          selected: false
        }
      ],
      showList: [
        {
          id: "all",
          text: "全部",
          st: true,
          condition: 0
        },
        {
          id: "done",
          text: "完成",
          condition: 1
        },
        {
          id: "yet",
          text: "未完成",
          condition: 2
        }
      ],
      getTime: {
        createTime(t) {
          return `${new Date(t).getMonth(t) + 1}/${new Date(
            t
          ).getDate()}  ${new Date(t).getFullYear()}`;
        },
        editTime(t) {
          return `${new Date(t).getHours(t)}：${
            new Date(t).getMinutes() < 10
              ? "0" + new Date(t).getMinutes()
              : new Date(t).getMinutes()
          }  ${new Date(t).getMonth(t) + 1}/${new Date(t).getDate()}`;
        }
      }
    };
  },
  computed: {
    showTodo() {
      return this.todos.filter(todos => {
        return todos.isShow;
      });
    }
    // vue的官方文件提到,v-for和v-if得避免放在同個tag,因此在這利用computed在每次有更新時計算一次過濾掉不符合條件,達到v-if的功能。
  },
  created() {
    this.todos.forEach(item => {
      item.isShow = true;
    });
    this.todos.push({
      content: "時空旅人",
      createTime: 1558055916,
      editable: false,
      completed: false,
      isShow: true,
      isEdit: false
    });
    this.saveData();
  },
  methods: {
    saveData() {
      localStorage.setItem("todolist", JSON.stringify(this.todos));
    },
    getTodos(todo) {
      if (this.newTodo.length == 0) {
        return;
      }
      let createStamp = Math.floor(new Date().getTime() / 1);
      // 創立一個時間戳
      this.todos.unshift({
        content: todo,
        createTime: createStamp,
        editable: false,
        completed: false,
        isShow: true,
        editTime: createStamp,
        isEdit: false
      });
      // unshift,push的相反
      this.reset();
      this.saveData();
      // 更新localStorage的資料
      this.newTodo = "";
    },
    removeTodo: function(id) {
      this.todos = this.todos
        .slice(0, id)
        .concat(this.todos.slice(id + 1, this.todos.length));
      // 不是直接去掉某一項,而是將欲刪除的項目作基準點將前後的物件接起來形成新的陣列
      // this.todos.splice(id, 1);
      this.saveData();
    },
    // 刪除想刪除的事項,參數是要讓瀏覽器知道要刪除哪一個項目
    update(todo) {
      let createEditStamp = Math.floor(new Date().getTime() / 1);
      todo.editTime = createEditStamp;
      // 編輯當下產生timeStamp並記錄在編輯時間內,後面如法炮製讀取edit的時間戳產生編輯時間
      todo.isEdit = true;
      todo.editable = false;
      this.saveData();
    },
    filter() {
      let filterArry = this.filterText.toLowerCase().split("|");
      // 把過濾input的字串無視大小寫並且出現空白就分隔開拉產生陣列
      this.todos.forEach(item => {
        // forEach拿來找出todos的content和completed
        let isValid = true;
        let content = item.content.toLowerCase();
        for (let value of filterArry) {
          // 也要對split後的陣列做for來比對
          switch (value) {
            case ".done":
              // 檢查是不是 done
              if (item.completed) {
                isValid = false;
              }
              // 再檢查completed是不是false,是就關掉,這樣儘管條件只有done也能顯示
              break;
            case ".yet":
              // 檢查是不是yet
              if (!item.completed) {
                isValid = false;
              }
              // 再檢查completed是不是true,是就關掉,這樣儘管條件只有yet也能顯示
              break;
            case ".month:" + (new Date(item.createTime).getMonth() + 1):
              break;
            case ".days:" + new Date(item.createTime).getDate():
              break;
            case ".year:" + new Date(item.createTime).getFullYear():
              break;
            // 因為case的條件太嚴格,所以不用再多多餘的判斷,符合條件就safe,反之繼續向下
            default:
              if (content.indexOf(value) < 0) {
                isValid = false;
              }
            // 都不是,也就是一般字串搜尋(包含是不是done或yet,因為也是字串)就跑這
          }
        }
        item.isShow = isValid;
      });
    },
    clear() {
      this.todos.forEach(item => {
        item.isShow = true;
      });
      this.filterText = "";
    },
    // 清除過濾器的文字回到使用過濾器前的狀態
    arrange(e) {
      let st = e.target.dataset.st;
      let todos = this.todos;
      for (let list of this.toolsList) {
        let isValid = false;
        switch (st) {
          case "recentCreateTime":
            if (list.st == "recentCreateTime") {
              isValid = true;
            }
            todos.sort(function(a, b) {
              return b.createTime - a.createTime;
            });
            break;
          case "pastCreateTime":
            if (list.st == "pastCreateTime") {
              isValid = true;
            }
            todos.sort(function(a, b) {
              return a.createTime - b.createTime;
            });
            break;
          case "editTime":
            if (list.st == "editTime") {
              isValid = true;
            }
            todos.sort(function(a, b) {
              return b.editTime - a.editTime;
            });
            break;
        }
        // 用filter一樣的做法去更動toolsList的selected,並用if去判斷是改哪一項,讓:class知道哪一項的selected是true進而掛上想要的class
        list.selected = isValid;
      }
      // 越近的時間timeStamp越大,所以能透過timeStamp用sort做排序。

    },
    dltBtn() {
      let temArry = [];
      for (let value of this.todos) {
        if (!value.completed) {
          temArry.push(value);
        }
      }
      this.todos = temArry;
      // immutable的概念,不對原本陣列做改動,而是將依照條件過濾出的的陣列去取代
      // 這裡將合乎條件,也就是未完成的的推進一個暫存區,之後取代原本陣列的就是沒有 completed==true 的陣列
      this.saveData();
    },
    reset() {
      let todos = this.todos;
      todos.forEach(item => {
        item.isShow = true;
      });
      todos.sort(function(a, b) {
        return b.createTime - a.createTime;
      });
      for (let list of this.toolsList) {
        list.selected = false;
      }
      this.condition = 0;
      this.filterText = "";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  font-family: "Baloo Bhai", cursive;
  font-family: "Source Code Pro", monospace;
}
a {
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

#todo {
  display: flex;
  align-items: center;
  flex-direction: column;
  border: solid black;
  padding: 20px;
  width: 1000px;
  height: 600px;
}
.lists .num,
.things,
.date {
  padding: 0 10px;
}
.getTodo,
.filter {
  text-align: center;
  margin-bottom: 20px;
  width: 80%;
}
.tools {
  position: relative;
  display: flex;
  width: 80%;
}
.filter {
  width: 50%;
  margin: 0 124px 20px 0;
}
.btn {
  height: 38px;
}
.dltBtn {
  width: 108px;
  margin-right: 30px;
}
.clear {
  position: absolute;
  top: 4px;
  left: 355px;
  font-size: 20px;
  font-weight: 100;
  color: #b1bbc5;
  cursor: pointer;
  transition-duration: 0.5s;
}
.clear:hover {
  color: #485055;
}

.showBox {
  width: 80%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.showBox label {
  margin-right: 20px;
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
.checkbox {
  display: inline-block;
  width: 17px;
  height: 15px;
  line-height: 10px;
  text-align: center;
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
.editTime {
  font-size: 12px;
  color: #acbcca;
  line-height: 40px;
  transition-duration: 0.5s;
}
.editTime:hover {
  color: #000;
}
.dlt {
  position: relative;
  height: 20px;
  transition-duration: 0.5s;
  width: 30px;
  height: 30px;
  padding: 10px;
}
.left,
.right {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 50%;
  transform: translate(-50%, -50%);
  border: solid 1px #000;
  transition-duration: 0.5s;
}
.dlt:hover .left {
  left: 25%;
  transform: rotate(45deg);
}
.dlt:hover .right {
  left: 25%;
  transform: rotate(-45deg);
}
</style>
