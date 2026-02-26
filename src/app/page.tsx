const MainPage = () => {
  return (
  <div className="flex flex-col min-h-screen justify-center items-center w-full">
    <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 -translate-y-20">
      Welcome To Layer7 Blog
    </div>
    
    <img 
      className="w-1/2 -translate-y-20 rounded-2xl shadow-lg" 
      src={"https://photo.coolenjoy.co.kr/data/editor/2005/thumb-Bimg_5ac46cf57486ab10f3183724991e9de3_zclf.jpg"}
    />
  </div>
);
}
export default MainPage