<template>
  <div id="outer">
    <div :class="{showPanel:showPanel == true }" class="panel">
      <h2>Todolist快覽</h2>
      <div @click="showPanel = !showPanel" class="expand">
        <div class="showLine" :class="{showLeft:showPanel == false }"></div>
        <div class="showLine" :class="{showRight:showPanel == false }"></div>
      </div>
      <ul :class="{showul:showPanel == true }" class="todo_ul list-group">
        <router-link to="/todolist">
          <li @click="arrange(0),DoneOrEdit($event)" class="lists list-group-item">
            <span class="things">最近新增:{{(recentTodo.length > 0)? recentTodo[0].content:" "}}</span>
          </li>
        </router-link>
        <router-link to="/todolist">
          <li @click="arrange(2),DoneOrEdit($event)" data-id="1" class="lists list-group-item">
            <span
              data-id="1"
              class="things"
            >最近修改:{{(editedTodo.length > 0) ? editedTodo[0].content:" "}}</span>
            <!-- 避免空陣列造成顯示出錯,因此長度！>0的就顯示空白 -->
          </li>
        </router-link>
        <router-link to="/todolist">
          <li @click="arrange(3),DoneOrEdit($event)" data-id="2" class="lists list-group-item">
            <span
              data-id="2"
              class="things"
            >最近完成:{{(doneTodo.length > 0)? doneTodo[0].content:" "}}</span>
            <!-- 避免空陣列造成顯示出錯,因此長度！>0的就顯示空白 -->
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "home",
  data() {
    return {
      showPanel: false
    };
  },
  created() {},
  computed: {
    ...mapGetters({
      todos: "importTodos"
    }),
    editedTodo() {
      let temArry = [];
      for (let item of this.todos) {
        if (item.isEdit && !item.completed) {
          temArry.unshift(item);
        }
      }
      // 只推符合條件的,讓陣列更單純較好操作
      return temArry.slice().sort((a, b) => {
        return b.editTime - a.editTime;
      });
    },
    doneTodo() {
      let temArry = [];
      for (let item of this.todos) {
        if (item.completed) {
          temArry.unshift(item);
        }
      }
       // 只推符合條件的,讓陣列更單純較好操作
      return temArry.slice().sort((a, b) => {
        return b.doneTime - a.doneTime;
      });
    },
    recentTodo() {
      return this.todos.slice().sort((a, b) => {
        return b.createTime - a.createTime;
      });
    }
  },
  // slice會回傳新陣列,所以解決了無限loop的問題
  methods: {
    ...mapMutations(["arrange", "DoneOrEdit"])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#outer {
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
  width: 100%;
  height: 100%;
}
.panel {
  position: relative;
  border: solid 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 50px 0 20px;
  width: 250px;
  height: 50px;
  transition-duration: 0.5s;
}
.expand {
  border: solid 2px;
  position: absolute;
  right: 5px;
  top: 5px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.showPanel {
  padding: 60px 0;
  width: 800px;
  height: 370px;
}
.showul {
  margin: 40px auto 0;
}
.showLine {
  border: solid 1px;
  width: 90%;
  position: absolute;
  left: 50%;
  top: 50%;
  width: 90%;
  transform: translate(-50%, -50%);
  border: solid 1px #000;
  transition-duration: 0.5s;
}
.showLeft {
  left: 5%;
  top: 45%;
  transform: rotate(90deg);
}

.editTime {
  font-size: 14px;
  color: #000;
  line-height: 20px;
  transition-duration: 0.5s;
  position: absolute;
  right: 15px;
  top: 25%;
}
</style>
