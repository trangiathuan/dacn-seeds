import Nav from "../../component/navbar/navbar";
import Footer from "../../component/footer/footer"
import './blog.css'

const Blog = () => {
    return (
        <div>
            <Nav />
            <div>
                <div className="main-blog">
                    <div className="main-write">
                        <div className="input-write">
                            <p className="title-write">Đăng bài viết</p>
                            <textarea className="form-control form-control-lg" type="text" placeholder="" aria-label=".form-control-lg example" />
                        </div>
                        <div className="btn-write">
                            <button type="button" class="btn btn-add-img1">
                                <img className="img1" src={require('../../asset/Images/image.png')} />
                                <span> Thêm ảnh</span>
                            </button>
                            <button type="button" class="btn btn-add-img2">
                                <img className="img2" src={require('../../asset/Images/edit.png')} />
                                <span> Đăng bài</span>
                            </button>                        </div>

                    </div>
                    <div className="main-content">

                        <div className="info-user-cmt">
                            <img className='' src={require('../../asset/Images/account.png')} />
                            <p className='name-info-user-cmt'>Tran Gia Thuận <span className='date-comment ms-2'>24/09/2024</span>

                            </p>
                            <div className="option-menu">

                                <div class="dropdown">
                                    <button class=" btn btn-option " type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={require('../../asset/Images/option.png')} />
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#">Xóa</a></li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="content-write">
                            <p>[THÔNG BÁO]
                                Triển khai chương trình học bổng quốc tế E-International tài trợ lên tới 70% học phí cho chương trình IELTS và tiếng Anh giao tiếp.
                                1. Các nhà đồng hành và tài trợ:
                                - Đây là chương trình học bổng cộng đồng quy tụ nhiều đơn vị lớn, uy tín trong và ngoài nước.
                                - Đối tác học thuật, công nghệ, tài chính, đào tạo: Elsa Corp, Viện đào tạo ITED, SunUni Academy,...
                                - Đối tác hỗ trợ tài chính: Rootopia, Payoo,...
                                - Đồng hành truyền thông: Báo Tuổi trẻ thu đô, VTV, Vnexpress, VTC, Tiếp Thị và Gia đình,...
                                Chương trình có sự tham gia chung tay tài trợ và đồng hành của nhiều đối tác lớn, uy tín ở trong và ngoài nước: Báo Tuổi trẻ thủ đô, Elsa Corp, SunUni Academy, Rootopia, Payoo,...
                                - Chương trình: IELTS và Giao tiếp
                                - Số lượng học bổng tài trợ giới hạn: 3000 suất
                                - Đối tượng tham gia xét duyệt: học sinh từ 13 tuổi, sinh viên, người đi làm trong và ngoài nước. Những người đang mất gốc tiếng Anh.</p>
                        </div>
                        <div className="brg-img mt-2 mb-3">
                            <img className="img-blog" src={require('../../asset/images-product/h01.jpg')} />
                        </div>
                        <div>
                            <span>12 thích</span>
                            <span className="ms-3">15 Bình luận</span>
                        </div>
                        <div>
                            <hr></hr>
                            <button type="button" class="btn btn-primary btn-like">
                                <img src={require("../../asset/Images/like.png")} />
                                <span className="">Thích</span>
                            </button>
                            {/* <button type="button" class="btn btn-primary ms-2">Bình luận</button> */}
                        </div>
                        <div className="comment">
                            <hr></hr>

                            <div className="info-user-cmt mt-3">
                                <img className='' src={require('../../asset/Images/account.png')} />
                                <div>
                                    <div className="content-comment-blog">
                                        <p className='name-info-user-cmt'>Tran Gia Thuận <span className='date-comment'>24/09/2024</span></p>
                                        <p> Nhớ không em lời hứa ngày xưa, mình bên nhau dưới ánh trăng đã nguyện thề, rằng đôi mình có nhau không bao giờ lìa xa</p>
                                    </div>

                                </div>
                            </div>

                            <div className="info-user-cmt mt-3">
                                <img className='' src={require('../../asset/Images/account.png')} />
                                <div>
                                    <div className="content-comment-blog">
                                        <p className='name-info-user-cmt'>Tran Gia Thuận <span className='date-comment'>24/09/2024</span></p>
                                        <p> Nhớ không em lời hứa ngày xưa, mình bên nhau dưới ánh trăng đã nguyện thề, rằng đôi mình có nhau không bao giờ lìa xa</p>
                                    </div>

                                </div>
                            </div>
                            <div className="input-cmt">
                                <hr></hr>
                                <input class="form-control form-control-lg mt-3" type="text" placeholder="Bình luận" aria-label=".form-control-lg example" />
                                <button type="button" class="btn btn-primary mt-3 btn-comment">
                                    <img src={require("../../asset/Images/send.png")} />
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default Blog