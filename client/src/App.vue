<template>
  <div id="app">
    <h1 class="subtitle has-text-centered">Bucket List:</h1>
    <hr/>
    <div class="field has-addons">
      <div class="control is-expanded">
        <input class="input" v-model="description" type="text" placeholder="Go to mars..."/>
      </div>
      <div class="control">
        <button class="button is-info" @click="addItem" :disabled="!description">Add</button>
      </div>
    </div>
    <div class="notification" v-for="(item, i) in items" :key="item._id">
      <div class="columns">
        <input class="column input" v-if="isSelected(item)" v-model="editedDescriptions"/>
        <p v-else class="column">
          <span class="tag is-primary">{{ i + 1 }}</span>
          {{ item.description }}
        </p>
        <div class="column is-narrow">
          <span class="icon has-text-primary" @click="isSelected(item) ? unselect() : select(item)">
            <i class="material-icons">{{ isSelected(item) ? 'close' : 'edit' }}</i>
          </span>
          <span class="icon has-text-info" @click=" isSelected(item) ? updateItem(item, i): removeItem(item, i)">
            <i class="material-icons">{{ isSelected(item) ? 'save' : 'delete' }}</i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'App',
  data() {
    return {
      items: [],
      description: "",
      editedDescriptions: "",
      selected: {}
    }
  },
  async mounted() {
    const response = await axios.get('api/bucketListItems');
    this.items = response.data;
  },
  methods: {
    async addItem() {
      if (this.description.length > 2) {
        const response = await axios.post('api/bucketListItems', {
          description: this.description
        });
        this.items.push(response.data);
        this.description = "";
      }
    },
    async removeItem(item, i) {
      await axios.delete('api/bucketListItems/' + item._id);
      this.items.splice(i, 1);
    },
    select(item) {
      this.selected = item;
      this.editedDescriptions = item.description;
    },
    isSelected(item) {
      return item._id === this.selected._id;
    },
    unselect() {
      this.selected = {};
      this.editedDescriptions = "";
    },
    async updateItem(item, i) {
      const response = await axios.put('api/bucketListItems/' + item._id, {
        description: this.editedDescriptions
      });
      this.items[ i ] = response.data;
      this.unselect();
    }
  }
}
</script>

<style>
#app {
  margin: 3rem auto auto;
  max-width: 700px;
}

.material-icons {
  cursor: pointer;
}
</style>
