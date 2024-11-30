'use client';

import { useState } from 'react';
import Image from 'next/image';

type VolunteerType = {
  id: string;
  title: string;
  description: string;
  image: string;
};

type StepType = {
  number: number;
  title: string;
  description: string;
};

type FAQType = {
  question: string;
  answer: string;
};

const volunteerTypes: VolunteerType[] = [
  {
    id: 'education',
    title: '教育志工',
    description: '協助偏鄉學童課業輔導，提供教育資源，幫助孩子們擁有更好的學習機會。',
    image: '/images/education.jpg',
  },
  {
    id: 'environment',
    title: '環保志工',
    description: '參與環境保護活動，包括淨灘、植樹等，為地球永續發展盡一份心力。',
    image: '/images/environment.jpg',
  },
  {
    id: 'elderly',
    title: '長者關懷志工',
    description: '探訪獨居長者，提供生活協助和心靈陪伴，讓長者感受社會的溫暖。',
    image: '/images/elderly.jpg',
  },
];

const steps: StepType[] = [
  {
    number: 1,
    title: '線上報名',
    description: '填寫基本資料和興趣領域，讓我們更了解你。',
  },
  {
    number: 2,
    title: '參加培訓',
    description: '完成必要的志工培訓課程，學習服務技能。',
  },
  {
    number: 3,
    title: '開始服務',
    description: '選擇感興趣的服務項目，展開志工之旅。',
  },
  {
    number: 4,
    title: '經驗分享',
    description: '記錄服務心得，與其他志工交流成長。',
  },
];

const faqs: FAQType[] = [
  {
    question: '需要特殊專業背景嗎？',
    answer: '不需要特殊專業背景，只要有服務熱忱即可。我們會提供必要的培訓課程。',
  },
  {
    question: '服務時間有限制嗎？',
    answer: '服務時間非常彈性，可以根據個人時間安排選擇合適的服務項目。',
  },
  {
    question: '需要繳交費用嗎？',
    answer: '不需要繳交任何費用，但部分活動可能需要自行負擔交通費用。',
  },
];

// 表單組件
function VolunteerForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    volunteerType: [] as string[],
    motivation: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      volunteerType: checked
        ? [...prev.volunteerType, value]
        : prev.volunteerType.filter((type) => type !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: 實作 API 呼叫
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        volunteerType: [],
        motivation: '',
      });
    } catch (error) {
      console.error('提交表單時發生錯誤:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h3 className="mt-4 text-xl font-semibold text-green-800">
          報名成功！
        </h3>
        <p className="mt-2 text-green-600">
          感謝您報名成為志工，我們會盡快與您聯繫。
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="mt-4 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          填寫新的報名表
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="apply">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            姓名
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            電話
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          志工類型（可複選）
        </label>
        <div className="mt-2 space-y-2">
          {volunteerTypes.map((type) => (
            <div key={type.id} className="flex items-center">
              <input
                type="checkbox"
                id={type.id}
                name="volunteerType"
                value={type.id}
                checked={formData.volunteerType.includes(type.id)}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label
                htmlFor={type.id}
                className="ml-2 text-sm text-gray-700"
              >
                {type.title}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="motivation"
          className="block text-sm font-medium text-gray-700"
        >
          服務動機
        </label>
        <textarea
          id="motivation"
          name="motivation"
          required
          value={formData.motivation}
          onChange={handleInputChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          placeholder="請描述您想成為志工的原因..."
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-green-500 px-4 py-2 text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? '提交中...' : '提交報名'}
        </button>
      </div>
    </form>
  );
}

export default function VolunteerPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] bg-black">
        <Image
          src="/images/volunteer-hero.jpg"
          alt="志工服務"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="space-y-6 p-4">
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              加入我們的志工行列
            </h1>
            <p className="text-xl text-white/90 md:text-2xl">
              一起為社會帶來正向的改變
            </p>
            <a
              href="#apply"
              className="inline-block rounded-lg bg-green-500 px-8 py-3 font-semibold text-white transition hover:bg-green-600"
            >
              立即報名
            </a>
          </div>
        </div>
      </div>

      {/* 志工類型 */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {volunteerTypes.map((type) => (
            <div
              key={type.id}
              className="overflow-hidden rounded-xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-48">
                <Image
                  src={type.image}
                  alt={type.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-800">
                  {type.title}
                </h3>
                <p className="mb-4 text-gray-600">{type.description}</p>
                <a
                  href="#"
                  className="inline-flex items-center text-green-500 hover:text-green-600"
                >
                  了解更多
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 步驟說明 */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">
            如何成為志工
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white">
                  {step.number}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">
          常見問題
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-gray-200"
            >
              <button
                className="flex w-full items-center justify-between bg-white px-6 py-4 text-left hover:bg-gray-50"
                onClick={() =>
                  setActiveFaq(activeFaq === index ? null : index)
                }
              >
                <span className="text-lg font-medium text-gray-800">
                  {faq.question}
                </span>
                <svg
                  className={`h-6 w-6 transform text-gray-400 transition-transform ${
                    activeFaq === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {activeFaq === index && (
                <div className="bg-gray-50 px-6 py-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 報名表單 */}
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">志工報名</h2>
          <VolunteerForm />
        </div>
      </div>
    </div>
  );
}
