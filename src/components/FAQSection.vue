<template>
  <div>
    <h2>{{ t('faq_title') }}</h2>
    <div>
      <div
        v-for="(faq, index) in faqData"
        :key="index"
        class="faq-item"
        :class="{ active: activeFaq === index }"
      >
        <div class="faq-question" @click="toggleFaq(index)">
          <span>{{ t(faq.q) }}</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="faq-answer">
          {{ t(faq.a) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { translations } from '@/i18n/translations'

const store = useAlarmStore()
const activeFaq = ref(null)

const t = (key) => translations[store.currentLang]?.[key] || key

const faqData = [
  { q: 'faq_q1', a: 'faq_a1' },
  { q: 'faq_q2', a: 'faq_a2' },
  { q: 'faq_q3', a: 'faq_a3' },
  { q: 'faq_q4', a: 'faq_a4' },
  { q: 'faq_q5', a: 'faq_a5' },
  { q: 'faq_q6', a: 'faq_a6' },
  { q: 'faq_q7', a: 'faq_a7' },
  { q: 'faq_q8', a: 'faq_a8' },
  { q: 'faq_q9', a: 'faq_a9' },
  { q: 'faq_q10', a: 'faq_a10' }
]

function toggleFaq(index) {
  activeFaq.value = activeFaq.value === index ? null : index
}
</script>
