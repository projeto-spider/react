<template>
  <div>
    <a-list
      itemLayout="horizontal"
      :dataSource="items"
    >
      <a-list-item slot="renderItem" slot-scope="{item, criterion}, index">
        <a-list-item-meta>
          <div slot="description">
            <a-card :title="item.title" style="max-width: 90%">
              <div class="inspection-backlog-description">
                <p>Criteria: {{ criterion.title }}</p>

                <p>Description: {{ criterion.description }}</p>

                <p>Solution: {{ criterion.solution }}</p>

                <p>Assignee: TODO</p>
              </div>
            </a-card>
          </div>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
export default {
  name: 'VInspectionBacklogItems',

  props: {
    items: Array
  }
}
</script>

<style>
.inspection-backlog-description p {
  margin-bottom: 5px;
}
</style>
