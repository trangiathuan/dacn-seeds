import './footer.css'
const Footer = () => {
    return (
        <div className='footer'>
            <div className='footer-center'>
                <div className='row'>
                    <div className='col-3'>
                        <p className='footer-title'>Thông tin liên hệ</p>
                        <div>
                            <p className='p-title'><img className='category-img' src={require('../../asset/Images/footer-land.png')} /> Địa chỉ: Ấp Tân Quới, xã Tân Hòa Thành,<br /> huyện Tân Phước, tỉnh Tiền Giang</p>
                            <p className='p-title'><img className='category-img' src={require('../../asset/Images/footer-land.png')} /> Trụ sở chính: 1107 Đường Trần Phú,<br /> Phường Lộc Tiến, TP Bảo Lộc, Lâm Đồng</p>
                        </div>
                        <div>
                            <button className='btn btn-footer'>Tổng đài: 2100002435</button>
                        </div>
                        <p className='footer-title'>Hệ thống siêu thị</p>
                        <p className='p-title'>Kho hàng trải dài từ Bắc vào Nam</p>
                        {/* <p className='footer-title'>Theo dõi chúng tôi qua</p>
                        <div className='row row-logo'>
                            <div className='col-3'><img className='logo-footer' src={require('../../asset/Images/footer-fb.jpg')} /></div>
                            <div className='col-3'><img className='logo-footer' src={require('../../asset/Images/footer-ins.jpg')} /></div>
                            <div className='col-3'><img className='logo-footer' src={require('../../asset/Images/footer-tiktok.jpg')} /></div>
                            <div className='col-3'><img className='logo-footer' src={require('../../asset/Images/footer-zalo.png')} /></div>

                        </div> */}
                    </div>
                    <div className='col-3'>
                        <p className='footer-title ms-4'>Danh mục sản phẩm</p>
                        <div>
                            <ul>
                                <a href='#'><img className='category-img' src={require('../../asset/Images/wheat.png')} /> Hạt Giống Cây Ăn Trái</a>
                            </ul>
                            <ul>
                                <a href='#'><img className='category-img' src={require('../../asset/Images/wheat.png')} /> Hạt Giống Rau Mầm</a>
                            </ul>
                            <ul>
                                <a href='#'><img className='category-img' src={require('../../asset/Images/wheat.png')} /> Hạt Giống Dược Liệu</a>
                            </ul>
                            <ul>
                                <a href='#'><img className='category-img' src={require('../../asset/Images/wheat.png')} /> Hạt Giống Cây Cảnh</a>
                            </ul>
                            <ul>
                                <a href='#'><img className='category-img' src={require('../../asset/Images/wheat.png')} /> Hạt Giống Rau, Củ, Quả</a>
                            </ul>
                            <ul>
                                <a href='#'><img className='category-img' src={require('../../asset/Images/wheat.png')} /> Hạt Giống Rau Gia Vị</a>
                            </ul>
                            <ul>
                                <a href='#'><img className='category-img' src={require('../../asset/Images/wheat.png')} /> Hạt Giống Hoa</a>
                            </ul>
                            <ul>
                                <a href='#'><img className='category-img' src={require('../../asset/Images/wheat.png')} /> Hạt Giống Cỏ</a>
                            </ul>
                        </div>
                    </div>
                    <div className='col-3'>
                        <p className='footer-title  ms-4'>Hỗ trợ - dịch vụ</p>
                        <div>
                            <ul>
                                <a href='#'>Chính sách bảo mật</a>
                            </ul>
                            <ul>
                                <a href='#'>Chính sách kiểm hàng</a>
                            </ul>
                            <ul>
                                <a href='#'>Chính sách vận chuyển và giao hàng</a>
                            </ul>
                            <ul>
                                <a href='#'>Chính sách thanh toán</a>
                            </ul>
                            <ul>
                                <a href='#'>Chính sách bảo hành & đổi trả</a>
                            </ul>
                            <ul>
                                <a href='#'>Hướng dẫn mua hàng</a>
                            </ul>
                        </div>
                    </div>
                    <div className='col-3'>
                        {/* <p className='footer-title'>Hình thức thanh toán</p>
                        <div className='row row-logo'>
                            <div className='col-3'><img className='logo-footer' src={require('../../asset/Images/footer-momo.jpg')} /></div>
                            <div className='col-3'><img className='logo-footer' src={require('../../asset/Images/footer-zalopay.png')} /></div>
                            <div className='col-3'><img className='logo-footer' src={require('../../asset/Images/footer-vcb.png')} /></div>
                            <div className='col-3'><img className='logo-footer' src={require('../../asset/Images/footer-visa.jpg')} /></div>
                        </div> */}
                        <p className='footer-title'>Hình thức vận chuyển</p>
                        <div className='row row-logo'>
                            <div className='col-3'><img className='logo-footer' src={require('../../asset/Images/footer-vnp.png')} /></div>
                            <div className='col-3'><img className='logo-footer' src={require('../../asset/Images/footer-vtp.jpg')} /></div>
                            <div className='col-3'><img className='logo-footer' src={require('../../asset/Images/footer-ghtk.jpg')} /></div>
                            <div className='col-3'><img className='logo-footer' src={require('../../asset/Images/footer-lalamove.jpg')} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Footer;