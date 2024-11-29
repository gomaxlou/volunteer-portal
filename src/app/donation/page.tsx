'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import Link from 'next/link';

export default function DonationPage() {
  const [activeTab, setActiveTab] = useState('individual');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">愛心捐款</h1>

      {/* 捐款方式選擇 */}
      <div className="mb-8">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'individual'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            個案專戶
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'group'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            團體發展專戶
          </button>
        </div>

        {/* 個案專戶內容 */}
        {activeTab === 'individual' && (
          <div className="space-y-8">
            {/* 1.郵政劃撥帳款 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">1. 郵政劃撥捐款</h2>
              <p className="text-gray-600 mb-2">※ 劃撥手續支付手續費：每筆1,000元以下15元，每筆1,001元以上免元。</p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="mb-2">戶名：社團法人台灣展望青年義工團</p>
                <p>帳號：1976-6823（專戶用途：個案執行）</p>
              </div>
            </div>

            {/* 2.銀行匯款 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">2. 銀行匯款或轉帳</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="mb-2">戶名：社團法人台灣展望青年義工團</p>
                <p className="mb-2">銀行：國泰世華商業銀行　元昌分行</p>
                <p>帳號：016-03-003023-4（專戶用途：個案執行）</p>
              </div>
            </div>

            {/* 3.ATM轉帳 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">3. ATM轉帳</h2>
              <p className="text-gray-600 mb-4">（亦可使用全省國泰世華ATM內的無摺存款功能-可以做註記字，可查手續費）</p>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="mb-2">銀行代號：013</p>
                <p>帳號：016-03-003023-4（專戶用途：個案執行）</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-md text-blue-800">
                <p className="mb-2">※ 以上匯款或ATM轉帳及臨櫃世華ATM無摺存款的朋友們，請於提供特徵明細。姓名及領款收據寄送地址，聯繫方式有以下四種：</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>傳真至：02-8192-7474</li>
                  <li>e-mail至：921@hibox.hinet.net</li>
                  <li>來電聯絡 會計 呂小姐：0921-130-472</li>
                  <li>加LINE：（ID:0921-130472）名稱 黃昆財財務部</li>
                </ul>
              </div>
            </div>

            {/* 4.發票捐贈 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">4. 發票捐贈</h2>
              <p className="text-gray-600 mb-4">
                黃昆財會計的國泰帳592共2家可以捐贈電子發票的商家，如7-11、OK、萊爾富、家樂福，及一些網路商店，皆可捐贈電子發票，由財政部統一彙總。
              </p>
              <p className="text-gray-600">
                愛若有半邊已設定為入選者也需回填收據（專戶用途：個案執行）
              </p>
            </div>

            {/* 5.信用卡捐款 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">5. 信用卡捐款</h2>
              <p className="text-gray-600 mb-4">※ 請下載信用卡捐款同意書</p>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p>
                  可至官網下載信用卡捐款授權書，並傳真至(02)8192-7474，加LINE：（ID:0921-130472） 名稱：黃昆財財務部，或e-mail：921@hibox.hinet.net
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-md text-yellow-800">
                <p>
                  ※請抬頭處的捐款人可以選擇不指定用途或指定在一個案，也可以指定某一年或加以要指定捐贈(2015.03.30-03.31執行的某某器材山坡地維修打家庭訪視案)，我會在捐款收據上註明。
                </p>
                <p>若有不明瞭的地方歡迎來電0921-130472會計呂小姐，會細談為您解答。</p>
              </div>
            </div>
          </div>
        )}

        {/* 團體發展專戶內容 */}
        {activeTab === 'group' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">1. 銀行匯款轉帳或ATM轉帳</h2>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="mb-2">戶名：社團法人台灣展望青年義工團</p>
                <p className="mb-2">銀行：國泰世華商業銀行　元昌分行</p>
                <p className="mb-2">銀行代號：013</p>
                <p>帳號：016-03-500010-4（專戶用途：義工團團體發展基金）</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-md text-blue-800 mb-4">
                <p>
                  ※本帳為配合財政部頒佈『營所稅捐贈扣除額據實電子化作業』，為方便捐款人申報綜合所得列舉扣抵此作業及歸檔紀錄，敬請 貴捐款人簽立同意書，
                </p>
                <p>並所稅捐贈扣除額據實電子化作業填寫可至官網下載</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-md text-yellow-800">
                <p className="mb-2">
                  ※匯款捐款人後，並有捐款人姓與帳，會需次序平信寄送捐款收據予捐款人，若二個禮拜內未收到收據，麻煩請告知 會計 呂小姐
                </p>
                <p>聯絡電話：0921-130-472，LINE（ID:0921-130472） 名稱:黃昆財財務部</p>
              </div>
            </div>
          </div>
        )}

        {/* 下載區 */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">表單下載</h2>
          <div className="space-y-4">
            <Link
              href="/forms/donation-form.docx"
              className="flex items-center space-x-2 text-green-600 hover:text-green-700"
            >
              <Download size={20} />
              <span>信用卡捐款授權書 Word</span>
            </Link>
            <Link
              href="/forms/donation-form.pdf"
              className="flex items-center space-x-2 text-green-600 hover:text-green-700"
            >
              <Download size={20} />
              <span>信用卡捐款授權書 PDF</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
