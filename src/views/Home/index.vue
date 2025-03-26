<template>
  <div class="company-intro">
    <!-- 主标题区 -->
    <header class="hero-section">
      <h1 class="title">Добро пожаловать в Guangzhou Yiyu E-Commerce Co., Ltd</h1>
      <p class="subtitle">Ваш надежный партнер в китайско-российской электронной коммерции</p>
    </header>

    <!-- 核心内容区块 -->
    <main class="content-sections">
      <!-- 公司概况 -->
      <section class="about-section">
        <h2><span class="icon">🏢</span> О компании</h2>
        <div class="columns">
          <div class="text-content">
            <p>Основанная в 2020 году в Гуанчжоу, мы специализируемся на...</p>
            <ul class="advantages">
              <li v-for="(item, index) in advantages" :key="index">
                <span class="check-icon">✓</span> {{ item }}
              </li>
            </ul>
          </div>
          <div class="map-container">
            <img style="width: 100px;" src="https://raw.githubusercontent.com/KingOfChelsea/WorkPicGo/main/202503262052852.jpeg"  alt="Зона обслуживания в России" class="service-map">
          </div>
        </div>
      </section>

      <!-- 业务优势 -->
      <section class="features-section">
        <h2><span class="icon">🚀</span> Наши преимущества</h2>
        <div class="feature-cards">
          <div v-for="(feature, index) in features" :key="index" class="card">
            <h3>{{ feature.title  }}</h3>
            <p>{{ feature.description  }}</p>
          </div>
        </div>
      </section>

      <!-- 联系方式 -->
      <footer class="contact-section">
        <h2><span class="icon">📞</span> Контакты</h2>
        <div class="contact-info">
          <div class="contact-item">
            <span class="label">Эл. почта:</span>
            <a href="mailto:ru-support@yiyuecommerce.com">ru-support@yiyuecommerce.com</a>
          </div>
          <div class="contact-item">
            <span class="label">Телефон:</span>
            <a href="tel:+78002005050">8 (800) 200-50-50</a> (Бесплатно по России)
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 多语言配置
const advantages = [
  'Ежедневные авиаперевозки из Гуанчжоу в Москву',
  'Собственные склады в Москве и Санкт-Петербурге',
  'Поддержка платежей через Яндекс.Деньги и Сбербанк Онлайн',
  'Русскоязычная служба поддержки 24/7'
]

const features = ref([
  {
    title: 'Быстрая доставка',
    description: 'Гарантия доставки из Китая в Россию за 7-10 рабочих дней'
  },
  {
    title: 'Таможенное оформление',
    description: 'Полное сопровождение таможенных процедур'
  },
  {
    title: 'Локализация',
    description: 'Поддержка русской документации и технических спецификаций'
  }
])
</script>

<style scoped lang="postcss">
.company-intro {
  @apply max-w-7xl mx-auto px-4 py-8;

  .hero-section {
    @apply text-center mb-16;
    .title {
      @apply text-4xl font-bold text-blue-800 mb-4;
    }
    .subtitle {
      @apply text-2xl text-gray-600;
    }
  }

  .content-sections {
    @apply space-y-12;

    section {
      @apply bg-white rounded-xl p-8 shadow-lg;

      h2 {
        @apply text-3xl font-semibold mb-6 flex items-center;
        .icon {
          @apply mr-3;
        }
      }
    }

    .about-section {
      .columns {
        @apply grid md:grid-cols-2 gap-8;
        .text-content {
          @apply space-y-4;
          .advantages li {
            @apply flex items-start mb-3;
            .check-icon {
              @apply text-green-500 mr-2;
            }
          }
        }
        .map-container {
          @apply flex items-center justify-center;
          .service-map {
            @apply w-full h-auto max-h-96 object-contain;
          }
        }
      }
    }

    .features-section {
      .feature-cards {
        @apply grid md:grid-cols-3 gap-6;
        .card {
          @apply p-6 border rounded-lg hover:shadow-xl transition-shadow;
          h3 {
            @apply text-xl font-medium mb-2;
          }
          p {
            @apply text-gray-600 leading-relaxed;
          }
        }
      }
    }

    .contact-section {
      .contact-info {
        @apply space-y-4 text-lg;
        .contact-item {
          @apply flex items-center;
          .label {
            @apply font-medium w-32 flex-shrink-0;
          }
          a {
            @apply text-blue-600 hover:underline;
          }
        }
      }
    }
  }
}
</style>
