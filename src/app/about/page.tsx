import ClientLayout from '@/components/layout/ClientLayout'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <ClientLayout>
      <div className="bg-white">
        <div className="relative h-[50vh] min-h-[400px]">
          <Image
            src="/images/volunteer1.jpg"
            alt="寶島義工團"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">寶島緣起</h2>
            
            <div className="space-y-6 text-gray-600">
              <p>
                一九九九年，台灣遭逢世紀大災難──九二一地震，這個災難帶給台灣極度的震撼，但也喚醒無數人相互扶助的心，寶島義工團就在這種時空環境下形成，一群人把自己無私的愛凝聚在一起，緊緊扣住每一個團員，在這個大家庭裡愛與奉獻是不用言語的，我們只用行動表達來自內心深處的愛。
              </p>

              <p>
                寶島義工團從一個默默無名的民間小團體，緩慢而沉重的成長，現今約有八百多名成員，每次的動員人員數從早期的十幾人，至今年常態性有四五十人成行，甚至最高七八十人同時出團的紀錄。
              </p>

              <div className="my-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative h-48 md:h-64">
                  <Image
                    src="/images/volunteer2.jpg"
                    alt="團隊活動"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="relative h-48 md:h-64">
                  <Image
                    src="/images/volunteer3.jpg"
                    alt="社區服務"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="relative h-48 md:h-64">
                  <Image
                    src="/images/volunteer4.jpg"
                    alt="關懷長者"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-8">我們的服務</h2>
              <p>
                寶島義工團致力於各項社會服務，包括：
              </p>
              <ul className="list-disc pl-6 mb-8">
                <li>長者關懷與陪伴</li>
                <li>弱勢家庭援助</li>
                <li>社區清潔與維護</li>
                <li>緊急救援與物資發放</li>
                <li>青少年課業輔導</li>
              </ul>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                <div className="relative h-64">
                  <Image
                    src="/images/volunteer5.jpg"
                    alt="物資發放"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="relative h-64">
                  <Image
                    src="/images/volunteer6.jpg"
                    alt="青少年輔導"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              <p>
                二○○九年最高峰曾一次動員三百多名義工前往八八水災災區協助居民清理環境，用汗水與污泥奮戰。
              </p>

              <div className="relative h-[400px] my-12">
                <Image
                  src="/images/volunteer7.jpg"
                  alt="八八水災救援"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <p>
                並於二○一○年三月，寶島義工團與國際團體CDEP合作，前往柬埔寨村落替當地的醫療中心進行內部整建工程，將愛拓展到國際，也讓醫療中心得以順利營運，持續幫助更多需要幫助的人們。
              </p>

              <div className="relative h-[400px] my-12">
                <Image
                  src="/images/volunteer8.jpg"
                  alt="國際援助"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6">我們的理念</h3>

              <ul className="list-disc pl-6 space-y-4">
                <li>
                  秉持『用愛灌溉台灣』的理念，為地震重建區居民重建家園，為弱勢族群築屋整繕，期盼『人人有其屋』。
                </li>
                <li>
                  藉由社區居民參與造屋整繕過程，培養對社區乃至社會之認同感，主動關心，主動參與，形成生命共同體。
                </li>
                <li>
                  與國際愛心組織共同合作，讓臺灣行善的力量與實際的作為能夠灌溉荒漠與造福異國。祈使吾所住的寶島不僅是風景美麗的『福爾摩莎』，也是遍地愛心洋溢人人皆為愛心天使的『福爾摩莎』。
                </li>
                <li>
                  關懷弱勢族群，推廣愛家運動。
                </li>
              </ul>

              <div className="bg-green-50 p-6 rounded-lg mt-12">
                <p className="text-green-800">
                  「寶島義工團」在本階段除串聯各地培訓造屋義工，持續提供弱勢族群造屋整繕的服務工作外，將整合相關社會資源，循教育管道，將「寶島義工團」的精神根植於校園，以帶領青年朋友關心臨近社區需幫助的弱勢族群。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-12">
                <div className="relative h-64">
                  <Image
                    src="/images/volunteer9.jpg"
                    alt="社區服務"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="relative h-64">
                  <Image
                    src="/images/volunteer10.jpg"
                    alt="志工活動"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
