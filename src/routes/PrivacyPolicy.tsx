import { Box, Flex, Heading, Text, List, ListItem } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  return (
    <Flex direction="column" align="center" p={5} width="100%">
      <Helmet>
        <meta name="google-adsense-account" content="ca-pub-8391643725266611" />
      </Helmet>
      <Box maxW="800px">
        <Heading as="h1" size="xl" mb={5} textAlign="center">
          プライバシーポリシー
        </Heading>
        <Text mb={4}>
          　S&E株式会社（以下「当社」といいます。）は、ご利用者様からの信頼を第一と考え、ご利用者様個人に関わる情報を正確、かつ機密に取り扱うことは、当社にとって重要な責務であると考えております。
          <br />
          そのために、ご利用者様の個人情報に関する「個人情報保護方針」を制定し、個人情報の取り扱い方法について、全従業員及び関連会社への徹底を実践してまいります。
          <br />
          その内容は以下の通りです。なお、既に当社で保有し利用させて頂いている個人情報につきましても、本方針に従ってご利用者様の個人情報の取り扱いを実施致します。
        </Text>

        <Heading as="h2" size="md" mb={3}>
          当社について
        </Heading>
        <Text mb={4}>
          名称：S&E株式会社
          <br />
          代表者の氏名：代表取締役 李 相㬚
        </Text>

        <Heading as="h2" size="md" mb={3}>
          個人情報の取り扱いについて
        </Heading>

        <Heading as="h3" size="sm" mb={2}>
          （１）個人情報の取得
        </Heading>
        <Text mb={4}>
          当社は個人情報を適法かつ公正な手段により収集致します。ご利用者様に個人情報の提供をお願いする場合は、事前に収集の目的、利用の内容を開示した上で、当社の正当な事業の範囲内で、その目的の達成に必要な限度において、個人情報を収集致します。
        </Text>

        <Heading as="h3" size="sm" mb={2}>
          （２）個人情報の利用
        </Heading>
        <Text mb={4}>
          当社がお預かりした個人情報は、個人情報を頂いた方に承諾を得た範囲内又は利用目的に沿った範囲内で利用致します。利用目的については、以下の「利用目的の範囲」の内、当社の正当な事業の範囲内でその目的の達成に必要な事項を利用目的と致します。
        </Text>

        <Heading as="h4" size="sm" mb={2}>
          ●利用目的の範囲について
        </Heading>
        <List spacing={2} mb={4} styleType="disc" pl={4}>
          <ListItem>業務上のご連絡をする場合</ListItem>
          <ListItem>
            当社が取り扱う商品及びサービスに関するご案内をする場合
          </ListItem>
          <ListItem>
            ご利用者様からのお問い合せまたはご依頼等への対応をさせて頂く場合
          </ListItem>
          <ListItem>
            その他、ご利用者様に事前にお知らせし、ご同意を頂いた目的の場合
          </ListItem>
        </List>

        <Heading as="h4" size="sm" mb={2}>
          ●上記目的以外の利用について
        </Heading>
        <Text mb={4}>
          上記以外の目的で、ご利用者様の個人情報を利用する必要が生じた場合には、法令により許される場合を除き、その利用について、ご利用者様の同意を頂くものとします。
        </Text>

        <Heading as="h3" size="sm" mb={2}>
          （３）個人情報の第三者提供
        </Heading>
        <Text mb={4}>
          当社は、ご利用者様の同意なしに第三者へご利用者様の個人情報の提供は行いません。但し個人情報に適用される法律その他の規範により、当社が従うべき法令上の義務等の特別な事情がある場合は、この限りではありません。
        </Text>

        <Heading as="h3" size="sm" mb={2}>
          （４）個人情報の開示・訂正・利用停止・消去等の手続
        </Heading>
        <Text mb={4}>
          ご利用者様からご提供頂いた個人情報（第三者提供記録を含みます。）に関して、開示、訂正、利用停止、消去を要望される場合は、お問い合わせ先窓口までご請求ください。開示、訂正については、法令に定められている場合を除き、ご利用者様ご本人による請求であることが確認できた場合に限り、合理的な期間内に、ご利用者様の個人情報を開示、訂正致します。利用停止、消去については、法令に定められている事由がある場合で、ご利用者様ご本人による請求であることが確認できた場合に限り、合理的な期間内に、ご利用者様の個人情報を利用停止、消去致します。
        </Text>

        <Heading as="h3" size="sm" mb={2}>
          （５）外国における個人情報取り扱いの委託
        </Heading>
        <Text mb={4}>
          当社は、法令等に定める場合を除き、取得した個人情報の取り扱いの全部または一部を外国にある第三者に委託する場合には、あらかじめご本人からその旨の同意をいただいた上で委託いたします。個人情報を外国にある第三者に委託する場合には、ご利用者様に対し、委託先における個人情報の取扱いに関する制度、措置その他お客様の参考になる情報等を提供するとともに、個人情報の委託に係わる基本契約等の必要な契約を締結する等、必要な措置を講じます。但し個人情報に適用される法律その他の規範により、当社が従うべき法令上の義務等の特別な事情がある場合は、この限りではありません。
        </Text>

        <Heading as="h2" size="md" mb={3}>
          個人情報の保護に関する法令・規範の遵守について
        </Heading>
        <Text mb={4}>
          当社は、当社が保有する個人情報に関して適用される個人情報保護関連法令、規範及び個人情報保護委員会のガイドラインを遵守します。また本方針は、日本国の法律、その他規範により判断致します。本方針は、当社の個人情報の取り扱いに関しての基本的な方針を定めるものであり、当社は本方針に則って、個人情報保護法等の法令・規範に基づく個人情報の保護に努めます。
        </Text>

        <Heading as="h2" size="md" mb={3}>
          個人情報の安全管理措置について
        </Heading>
        <Text mb={4}>
          当社は、個人情報への不正アクセス、個人情報の紛失、破壊、改ざん、漏えい等から個人情報を保護し、正確性及び安全性を確保するために管理体制を整備し、適切な安全対策を実施致します。個人情報を取り扱う事務所内への部外者の立ち入りを制限し、当社の個人情報保護に関わる役員・職員等全員に対し教育啓発活動を実施するほか、管理責任者を置き個人情報の適切な管理に努めます。
        </Text>

        <Heading as="h2" size="md" mb={3}>
          CookieとWebビーコンの利用
        </Heading>
        <Text mb={4}>
          当社のWebサイトでは、ご利用者様のアクセス情報を取得するために「Cookie」や「Webビーコン」といった技術を利用しております。これらにより取得した情報はいずれも個人を特定することはできません。
          なお、当社のWebサイトを、お使いのブラウザーにおいてCookieを受け付けない設定や、画像を表示しない設定でご利用いただくことも可能ですが、その場合、Webサイトで提供している機能の一部がご利用できない場合がございます。
        </Text>

        <Heading as="h2" size="md" mb={3}>
          継続的な改善について
        </Heading>
        <Text mb={4}>
          当社は、個人情報保護への取組みについて、日本国の従うべき法令の変更、取り扱い方法、環境の変化に対応するため、継続的に見直し改善を実施致します。
        </Text>

        <Heading as="h2" size="md" mb={3}>
          お問い合わせ
        </Heading>
        <Text mb={4}>
          個人情報の取り扱いに関するお問い合わせや苦情については、下記窓口にて受け付けております。
          <br />
          【個人情報取扱い窓口】 ≪S&E株式会社≫
          <br />
          TEL：080-7895-9862
        </Text>
      </Box>
    </Flex>
  );
}
