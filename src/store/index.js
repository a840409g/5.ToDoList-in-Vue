import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
  count: 0,
  storeTodos: JSON.parse(localStorage.getItem("todolist")) || [],
  toolsList: [
    {
      st: "recentCreateTime",
      text: "依建立時間(近到遠)",
      sortMethod(a, b) {
        return b.createTime - a.createTime;
      }
    },
    {
      st: "pastCreateTime",
      text: "依建立時間(遠到近)",
      sortMethod(a, b) {
        return a.createTime - b.createTime;
      }
    },
    {
      st: "editTime",
      text: "最後編輯排序",
      sortMethod(a, b) {
        return b.editTime - a.editTime;
      }
    },
    {
      st: "doneTime",
      text: "最後完成排序",
      sortMethod(a, b) {
        return b.doneTime - a.doneTime;
      }
    }
  ],
}
const getters = {
  importTodos(state) {
    return state.storeTodos;
  },
  importToolsList(state) {
    return state.toolsList;
  }
}
const actions = {

}
const mutations = {
  todosToState(state, todo) {
    let createStamp = Math.floor(new Date().getTime() / 1);
    // 創立一個時間戳
    state.storeTodos.unshift({
      content: todo,
      createTime: createStamp,
      editable: false,
      completed: false,
      isShow: true,
      editTime: null,
      isEdit: false,
      doneTime: null
    });
    localStorage.setItem("todolist", JSON.stringify(state.storeTodos));
  },
  removeTodo(state, id) {
    state.storeTodos = state.storeTodos
      .slice(0, id)
      .concat(state.storeTodos.slice(id + 1, state.storeTodos.length));
    // 不是直接去掉某一項,而是將欲刪除的項目作基準點將前後的物件接起來形成新的陣列
    // this.todos.splice(id, 1);
    localStorage.setItem("todolist", JSON.stringify(state.storeTodos));
    // 刪除想刪除的事項,參數是要讓瀏覽器知道要刪除哪一個項目
  },
  dltBtn(state) {
    let temArry = [];
    for (let value of state.storeTodos) {
      if (!value.completed) {
        temArry.push(value);
      }
    }
    state.storeTodos = temArry;
    // immutable的概念,不對原本陣列做改動,而是將依照條件過濾出的的陣列去取代
    // 這裡將合乎條件,也就是未完成的的推進一個暫存區,之後取代原本陣列的就是沒有 completed==true 的陣列
    localStorage.setItem("todolist", JSON.stringify(state.storeTodos));
  },
  arrange(state, id) {
    let todos = state.storeTodos;
    todos.sort((a, b) => {
      return state.toolsList[id].sortMethod(a, b);
    });
    //  在點選時會判斷現在id是多少,而id也是item的順序編號,所以就能跟著知道要執行哪一個排序。
    // 越近的時間timeStamp越大,所以能透過timeStamp用sort做排序。
  },
  DoneOrEdit(state, e) {
    let id = e.target.dataset.id;
    for (let item of state.storeTodos) {
      let isValid = true;
      switch (id) {
        default:
          if (item.completed) {
            isValid = false
          }
          break;
          // 最近新增
        case "1":
          if (!item.isEdit || item.completed) {
            isValid = false;
          }
          break;
          // 顯示有編輯的且也過濾掉完成的
        case "2":
          if (!item.completed) {
            isValid = false;
          }
          break;
          // 顯示完成的
      }
      item.isShow = isValid;
    }
  }
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
