import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full py-8 px-4 mt-auto text-white/70 text-xs leading-relaxed">
            <div className="max-w-[1536px] mx-auto mb-12 px-2 sm:px-4">
                <hr className="border-gray-700 mb-12 mx-4" />
                <p className="my-3">
                    대표이사: 유병욱 | 사업자등록번호 : 250-81-00813
                </p>
                <p className="my-3 break-keep">
                    사업장: 서울시 강서구 마곡서로 205-21, 3층
                </p>
                <p className="my-3">
                    대표메일: spkoreaart@gmail.com | 전화번호: 070-8883-5120
                </p>
            </div>
        </footer>
    );
};

export default Footer;
