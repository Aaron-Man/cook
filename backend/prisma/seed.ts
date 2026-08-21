import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create statuses
  await prisma.status.createMany({
    data: [
      { content: '今天是个好日子！天气晴朗，心情愉快 ☀️', mood: '开心' },
      { content: '刚学会了一道新菜，好期待做给你吃！', mood: '甜蜜' },
      { content: '周末一起做饭吧～', mood: '嘴馋' },
    ],
  });

  // Create journals
  await prisma.journal.createMany({
    data: [
      {
        title: '我们的第一天',
        content: '今天是我们开始使用这个网站的第一天！\n\n这里将记录我们的点点滴滴，每一次美味的饭菜，每一个开心的瞬间。\n\n希望这个小小的空间能承载我们满满的回忆 ❤️',
        mood: '庆祝',
      },
      {
        title: '今天的晚餐',
        content: '今天做了番茄炒蛋，虽然是最简单的菜，但是用心做的味道就是不一样。\n\n下次试试加点糖，据说会更好吃。',
        mood: '开心',
      },
    ],
  });

  // Create dishes
  await prisma.dish.createMany({
    data: [
      {
        name: '番茄炒蛋',
        description: '经典家常菜，酸甜可口，营养丰富',
        category: '家常菜',
        ingredients: '番茄,鸡蛋,葱,盐,糖',
        difficulty: 1,
        available: true,
      },
      {
        name: '红烧肉',
        description: '肥而不腻，入口即化的经典红烧肉',
        category: '硬菜',
        ingredients: '五花肉,冰糖,酱油,料酒,八角,桂皮,姜',
        difficulty: 4,
        available: true,
      },
      {
        name: '蒜蓉西兰花',
        description: '清淡健康的绿色蔬菜',
        category: '素菜',
        ingredients: '西兰花,蒜,盐,油',
        difficulty: 1,
        available: true,
      },
      {
        name: '可乐鸡翅',
        description: '甜香入味，超级下饭',
        category: '硬菜',
        ingredients: '鸡翅,可乐,酱油,姜,蒜',
        difficulty: 2,
        available: true,
      },
      {
        name: '蛋炒饭',
        description: '粒粒分明，简单却考验功力',
        category: '主食',
        ingredients: '米饭,鸡蛋,葱,盐,油',
        difficulty: 2,
        available: true,
      },
      {
        name: '酸辣土豆丝',
        description: '酸辣爽口，开胃下饭',
        category: '家常菜',
        ingredients: '土豆,干辣椒,醋,盐,花椒',
        difficulty: 2,
        available: true,
      },
      {
        name: '糖醋排骨',
        description: '外酥里嫩，酸甜适中',
        category: '硬菜',
        ingredients: '排骨,糖,醋,酱油,料酒,姜',
        difficulty: 3,
        available: true,
      },
      {
        name: '芒果布丁',
        description: '香甜爽滑的饭后甜点',
        category: '甜点',
        ingredients: '芒果,牛奶,吉利丁,糖',
        difficulty: 2,
        available: true,
      },
    ],
  });

  // Create a sample order
  const firstDish = await prisma.dish.findFirst();
  if (firstDish) {
    await prisma.order.create({
      data: {
        dishId: firstDish.id,
        note: '今天想吃这个！',
        status: 'done',
      },
    });
  }

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
