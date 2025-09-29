<template>
  <div class="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead class="px-4 sticky right-0 text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="topics?.length">
          <TableRow
            v-for="row in flattenedRows"
            :key="row.type === 'topic' ? `topic-${row.data.id}` : `session-${row.data.id}`"
            :class="row.type === 'session' ? 'bg-muted/20' : 'hover:bg-muted/50'"
          >
            <!-- Topic Row -->
            <template v-if="row.type === 'topic'">
              <TableCell class="w-[50px]">
                <Button v-if="row.data.sessions?.length > 0" variant="ghost" size="sm" class="h-8 w-8 p-0" @click="toggleExpanded(row.data.id)">
                  <Icon :name="expandedTopics.includes(row.data.id) ? 'lucide:chevron-down' : 'lucide:chevron-right'" class="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>{{ row.data.order }}</TableCell>
              <TableCell class="font-medium">{{ row.data.title }}</TableCell>
              <TableCell class="max-w-xs truncate" :title="row.data.description">{{ row.data.description }}</TableCell>
              <TableCell class="px-4 sticky right-0 text-right">
                <div class="flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" @click="onAddSession(row.data)">
                    <Icon name="lucide:plus" class="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" @click="onEditTopic(row.data)">
                    <Icon name="lucide:edit" class="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    class="hover:bg-destructive/90 hover:text-destructive-foreground"
                    @click="onDeleteTopic(row.data)"
                  >
                    <Icon name="lucide:trash-2" class="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </template>

            <template v-else>
              <TableCell class="w-[25px]"></TableCell>
              <TableCell></TableCell>
              <TableCell class="text-muted-foreground">{{ row.data.title }}</TableCell>
              <TableCell></TableCell>
              <TableCell class="px-4 sticky right-0 text-right">
                <div class="flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" @click="onEditSession(row.data, row.topic)">
                    <Icon name="lucide:edit" class="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    class="hover:bg-destructive/90 hover:text-destructive-foreground"
                    @click="onDeleteSession(row.data, row.topic)"
                  >
                    <Icon name="lucide:trash-2" class="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </template>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell :colspan="5" class="text-center py-8">
            <div class="flex flex-col items-center justify-center gap-2">
              <span class="text-muted-foreground">No topics available</span>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const props = defineProps({
  topics: {
    type: Array,
    default: () => [],
  },
  academyId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['add-topic', 'edit-topic', 'delete-topic', 'add-session', 'edit-session', 'delete-session']);

const expandedTopics = ref([]);

// Flatten topics and sessions for easier rendering
const flattenedRows = computed(() => {
  const rows = [];
  props.topics.forEach((topic) => {
    // Add topic row
    rows.push({ type: 'topic', data: topic });

    // Add session rows if expanded
    if (expandedTopics.value.includes(topic.id) && topic.sessions?.length > 0) {
      topic.sessions.forEach((session) => {
        rows.push({ type: 'session', data: session, topic });
      });
    }
  });
  return rows;
});

const toggleExpanded = (topicId) => {
  const index = expandedTopics.value.indexOf(topicId);
  if (index > -1) {
    expandedTopics.value.splice(index, 1);
  } else {
    expandedTopics.value.push(topicId);
  }
};

// Topic actions
const onAddTopic = () => {
  emit('add-topic');
};

const onEditTopic = (topic) => {
  emit('edit-topic', topic);
};

const onDeleteTopic = (topic) => {
  emit('delete-topic', topic);
};

// Session actions
const onAddSession = (topic) => {
  emit('add-session', topic);
};

const onEditSession = (session, topic) => {
  emit('edit-session', session, topic);
};

const onDeleteSession = (session, topic) => {
  emit('delete-session', session, topic);
};
</script>
