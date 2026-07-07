import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@radman.local";
  const password = process.env.ADMIN_PASSWORD ?? "radman-admin-123";

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "مدیر رادمان",
      passwordHash: hashPassword(password)
    }
  });

  await prisma.product.deleteMany({
    where: {
      slug: {
        in: ["radman-blue-tray", "radman-river-set"]
      }
    }
  });

  const products = [
    {
      slug: "radman-ro-countertop",
      name: "دستگاه تصفیه آب رومیزی RO",
      shortDescription: "دستگاه تصفیه آب خانگی با فیلتراسیون چندمرحله‌ای و طراحی مناسب آشپزخانه.",
      description:
        "این دستگاه برای بهبود کیفیت آب آشامیدنی خانه طراحی شده و با ترکیب مراحل پیش‌فیلتر، کربن و ممبران RO، آب را برای مصرف روزانه شفاف‌تر و مطمئن‌تر می‌کند. مناسب آشپزخانه، دفتر کار و فضاهای کوچک.",
      price: 12800000,
      inventory: 5,
      isPublished: true,
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Yen_Sun_Technology_YS-8103RWT_20201101.jpg/640px-Yen_Sun_Technology_YS-8103RWT_20201101.jpg",
          alt: "دستگاه تصفیه آب رومیزی"
        }
      ]
    },
    {
      slug: "radman-air-purifier-hepa",
      name: "دستگاه تصفیه هوا HEPA",
      shortDescription: "تصفیه هوای خانگی برای کاهش گردوغبار، آلرژن‌ها و ذرات معلق.",
      description:
        "دستگاه تصفیه هوا با فیلتر HEPA برای اتاق خواب، پذیرایی و محیط کار مناسب است. این مدل برای کارکرد آرام، مصرف روزانه و بهبود کیفیت هوای داخل ساختمان در نظر گرفته شده است.",
      price: 9700000,
      inventory: 7,
      isPublished: true,
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/%E3%83%91%E3%83%8A%E3%82%BD%E3%83%8B%E3%83%83%E3%82%AF_F-VX40H3_20160922.jpg/640px-%E3%83%91%E3%83%8A%E3%82%BD%E3%83%8B%E3%83%83%E3%82%AF_F-VX40H3_20160922.jpg",
          alt: "دستگاه تصفیه هوا خانگی"
        }
      ]
    },
    {
      slug: "radman-air-purifier-plus",
      name: "تصفیه هوای هوشمند پلاس",
      shortDescription: "مدل پیشرفته‌تر برای فضاهای بزرگ‌تر با جریان هوای قوی و طراحی ایستاده.",
      description:
        "این مدل برای خانه‌های بزرگ‌تر، دفاتر و فضاهایی که نیاز به گردش هوای بیشتر دارند مناسب است. ظاهر مینیمال و بدنه ایستاده آن باعث می‌شود کنار مبلمان یا میز کار هم تمیز و مرتب دیده شود.",
      price: 15600000,
      inventory: 3,
      isPublished: true,
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sharp_FU-888SV_20061017.jpg/640px-Sharp_FU-888SV_20061017.jpg",
          alt: "دستگاه تصفیه هوای ایستاده"
        }
      ]
    }
  ];

  for (const product of products) {
    const { images, ...productData } = product;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...productData,
        images: {
          deleteMany: {},
          create: images.map((image, index) => ({
            ...image,
            sortOrder: index
          }))
        }
      },
      create: {
        ...productData,
        images: {
          create: images.map((image, index) => ({
            ...image,
            sortOrder: index
          }))
        }
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
