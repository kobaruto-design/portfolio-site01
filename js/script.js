// ページ読み込み完了時に実行
document.addEventListener('DOMContentLoaded', function() {
    // メニュートグルの機能
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const body = document.body;
    const navLinks = document.querySelectorAll('nav ul li a');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // モバイルメニュー表示時に背景スクロールを防止
            if (nav.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    }

    // ナビゲーションリンクのクリックイベント
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                body.style.overflow = '';
            }
        });
    });
    
    // ウィンドウサイズが変更された時の処理
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // スクロール時のヘッダースタイル変更
    const header = document.querySelector('header');
    let scrollPosition = 0;
    let lastScrollPosition = 0;
    
    function updateHeaderStyle() {
        scrollPosition = window.scrollY;
        
        // スクロール方向の検出
        const isScrollingDown = scrollPosition > lastScrollPosition;
        const isScrollingUp = scrollPosition < lastScrollPosition;
        
        if (scrollPosition > 50) {
            header.style.padding = window.innerWidth < 768 ? '8px 0' : '10px 0';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            
            // モバイルでのスクロール方向に応じたヘッダー表示制御
            if (window.innerWidth <= 768) {
                if (isScrollingDown && scrollPosition > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else if (isScrollingUp) {
                    header.style.transform = 'translateY(0)';
                }
            }
        } else {
            header.style.padding = window.innerWidth < 768 ? '15px 0' : '20px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollPosition = scrollPosition;
    }
    
    window.addEventListener('scroll', updateHeaderStyle);
    window.addEventListener('resize', updateHeaderStyle);
    
    // 初期設定
    updateHeaderStyle();
    
    // スムーススクロール
    const links = document.querySelectorAll('a[href^="#"]');
    
    for (const link of links) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // モバイルメニューが開いている場合は閉じる
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                body.style.overflow = '';
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // ヘッダー分のオフセットをデバイスサイズに応じて調整
                const headerOffset = window.innerWidth < 768 ? 60 : 80;
                const targetPosition = targetElement.offsetTop - headerOffset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // フォーム送信処理
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // フォーム要素の取得
            const nameInput = contactForm.querySelector('input[type="text"]');
            const emailInput = contactForm.querySelector('input[type="email"]');
            const messageInput = contactForm.querySelector('textarea');
            
            // 簡易バリデーションと送信確認
            if (nameInput.value && emailInput.value && messageInput.value) {
                // 実際のプロジェクトではここでAjaxによるフォーム送信処理を実装
                
                // 送信確認メッセージ
                alert('お問い合わせありがとうございます。担当者が確認次第、ご連絡いたします。');
                
                // フォームリセット
                contactForm.reset();
            } else {
                alert('すべての必須項目を入力してください。');
            }
        });
    }
    
    // Intersection Observer APIを使用したアニメーション
    const animateElements = document.querySelectorAll('.service-card, .work-item, .about-content, .contact-content');
    
    // デバイスのパフォーマンスに基づいてアニメーションを調整
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animationDuration = isReducedMotion ? '0.3s' : '0.5s';
    const animationDistance = isReducedMotion ? '10px' : '20px';
    
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                
                // 一度表示されたら監視を解除（モバイルでのパフォーマンス向上）
                if (window.innerWidth < 768) {
                    animateObserver.unobserve(entry.target);
                }
            }
        });
    }, { 
        threshold: window.innerWidth < 768 ? 0.1 : 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // 初期スタイルを設定し、オブザーバーに要素を登録
    animateElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = `translateY(${animationDistance})`;
        element.style.transition = `opacity ${animationDuration} ease, transform ${animationDuration} ease`;
        animateObserver.observe(element);
    });

    // タッチデバイスでのダブルタップズーム防止
    document.addEventListener('touchend', function(e) {
        if (e.touches.length < 2) {
            e.preventDefault();
        }
    }, { passive: false });
}); 