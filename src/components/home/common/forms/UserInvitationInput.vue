<script setup lang="ts">
import { Envelope } from '@vicons/fa';
import { NButton, NIcon } from 'naive-ui';
import type { AnyRole } from '@/types/scope';
import RoleDropdown from './RoleDropdown.vue';
import UsernameInput from './UsernameInput.vue';

const props = withDefaults(
  defineProps<{
    invitationButton?: boolean;
  }>(),
  {
    invitationButton: false,
  },
);

const emit = defineEmits<{
  click: [];
}>();

const modelUsername = defineModel<string>("username", { required: true });
const modelRole = defineModel<AnyRole>("role", { required: true });

const handleClick = (e: MouseEvent) => {
  e.preventDefault();
  emit('click');
}
</script>

<template>
  <div class="flex space-x-1! flex-1">
    <UsernameInput v-model="modelUsername" />
    <RoleDropdown
      @select="(role: AnyRole) => modelRole = role"
      :button-role="modelRole"
      :filter="(role: AnyRole) => !role.endsWith('OWNER')"
      size="medium"
    />
    <n-button v-if="invitationButton" @click="handleClick" class="rounded-lg!" type="info">
      <template #icon>
        <n-icon :size="14">
          <Envelope />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>
