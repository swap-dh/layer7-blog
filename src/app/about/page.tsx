import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">About</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>블로그 소개</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">이 블로그는 Layer7 동아리에서 운영하는 블로그입니다. <br></br>동아리에 대한 정보와 활동을 공유하는 공간입니다.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>연락처</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">문의사항이나 제안사항이 있으시면 언제든 연락 주세요.</p>
          <div className="space-y-1">
            <p>부장 (유승주):<br></br> 📧 Email: magnolia@layer7.kr<br></br>📞 Number: (+82) 010-4196-7139</p>
            <p>김세중 (부부장):<br></br> 📧 Email : 0uyl@layer7.kr<br></br>📞 Number: (+82) 010-2142-5063</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;


