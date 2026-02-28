-- products.json 데이터를 기반으로 한 INSERT SQL
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- 기존 데이터 삭제 (선택사항)
-- DELETE FROM public.products;

-- 상품 데이터 삽입
INSERT INTO public.products (title, price, location, image, material, dimensions, condition, style, stock, is_active) VALUES
('1950년대 덴마크 티크 사이드보드', 1850000, '서울 강남구', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=450&fit=crop', '티크우드', '180 × 45 × 80cm', '최상', '미드센추리', 1, true),
('프렌치 프로방스 앤틱 다이닝 테이블', 3200000, '경기 성남시', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=450&fit=crop', '오크우드', '200 × 100 × 76cm', '상', '프로방스', 1, true),
('빅토리안 체스터필드 3인 소파', 2800000, '서울 용산구', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=450&fit=crop', '월넛 + 가죽', '220 × 90 × 85cm', '상', '빅토리안', 1, true),
('일본 쇼와시대 찬장', 890000, '부산 해운대구', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=450&fit=crop', '삼나무', '120 × 40 × 180cm', '중', '쇼와', 1, true),
('아르데코 드레싱 테이블', 1450000, '서울 마포구', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=450&fit=crop', '마호가니', '100 × 50 × 150cm', '최상', '아르데코', 1, true),
('스칸디나비안 윙체어', 720000, '인천 연수구', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=450&fit=crop', '비치우드', '75 × 80 × 100cm', '상', '스칸디', 1, true),
('빈티지 체스테리 드레서', 1680000, '서울 종로구', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=450&fit=crop', '체리우드', '120 × 50 × 140cm', '상', '빅토리안', 1, true),
('미국 빈티지 록커체어', 950000, '경기 부천시', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=450&fit=crop', '오크우드 + 가죽', '70 × 70 × 105cm', '상', '미드센추리', 1, true),
('프랑스 앤틱 미니어처 캐비닛', 1250000, '서울 송파구', 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&h=450&fit=crop', '마호가니', '80 × 35 × 90cm', '최상', '프로방스', 1, true),
('네덜란드 빈티지 서재 책상', 1980000, '서울 서초구', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=450&fit=crop', '월넛우드', '140 × 70 × 75cm', '최상', '미드센추리', 1, true),
('영국 앤틱 소파 테이블', 850000, '경기 수원시', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=450&fit=crop', '마호가니', '100 × 50 × 45cm', '상', '빅토리안', 1, true),
('스웨덴 빈티지 수납장', 1580000, '서울 강서구', 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&h=450&fit=crop', '비치우드', '180 × 40 × 200cm', '상', '스칸디나비안', 1, true),
('프랑스 프로방스 식탁 의자 세트', 2400000, '부산 서구', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=450&fit=crop', '오크우드', '의자 6개', '상', '프로방스', 1, true),
('일본 쇼와시대 수장장', 1150000, '대전 유성구', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=450&fit=crop', '삼나무', '150 × 45 × 190cm', '중', '쇼와', 1, true),
('아르데코 미러 드레싱 테이블', 1750000, '서울 노원구', 'https://images.unsplash.com/photo-1556228720-db89ddb48d03?w=600&h=450&fit=crop', '마호가니 + 거울', '110 × 45 × 160cm', '최상', '아르데코', 1, true),
('덴마크 미드센추리 TV 캐비닛', 1350000, '인천 남동구', 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600&h=450&fit=crop', '티크우드', '160 × 50 × 60cm', '상', '미드센추리', 1, true),
('영국 빅토리안 의자 세트', 2200000, '서울 은평구', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=450&fit=crop', '월넛우드 + 벨벳', '의자 4개', '최상', '빅토리안', 1, true),
('프랑스 앤틱 커피 테이블', 980000, '광주 북구', 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&h=450&fit=crop', '오크우드', '90 × 90 × 50cm', '상', '프로방스', 1, true),
('스칸디나비안 북스토리지', 1100000, '경기 안양시', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=450&fit=crop', '비치우드', '120 × 30 × 180cm', '상', '스칸디나비안', 1, true),
('미국 빈티지 데스크 체어', 680000, '서울 금천구', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=450&fit=crop', '체리우드', '55 × 55 × 95cm', '중', '미드센추리', 1, true),
('이탈리아 빈티지 거실장', 1950000, '서울 동작구', 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&h=450&fit=crop', '월넛우드', '200 × 50 × 65cm', '최상', '미드센추리', 1, true),
('프랑스 프로방스 베드 사이드 테이블', 750000, '부산 사하구', 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&h=450&fit=crop', '오크우드', '50 × 40 × 60cm', '상', '프로방스', 1, true),
('영국 빅토리안 코너 캐비닛', 1650000, '대구 수성구', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=450&fit=crop', '마호가니', '100 × 100 × 180cm', '상', '빅토리안', 1, true),
('덴마크 미드센추리 식탁', 2100000, '서울 강동구', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=450&fit=crop', '티크우드', '180 × 90 × 74cm', '최상', '미드센추리', 1, true);

-- 삽입 확인
SELECT COUNT(*) as total_products FROM public.products;

-- ==========================================
-- 고객(customers) 샘플 데이터 삽입
-- ==========================================
-- 주의: customers 테이블의 id는 auth.users(id)를 참조합니다.
-- 실제 auth.users에 존재하는 사용자만 customers 테이블에 삽입할 수 있습니다.
-- 아래는 실제 사용자가 있는 경우에만 샘플 데이터를 삽입합니다.

-- 실제 auth.users에 존재하는 사용자 ID를 사용하여 고객 데이터 삽입
-- 최대 3명의 사용자가 있으면 샘플 데이터로 삽입
DO $$
DECLARE
    user_count INTEGER;
    user_ids UUID[];
    i INTEGER;
BEGIN
    -- auth.users에서 사용자 ID 가져오기 (최대 3명)
    SELECT ARRAY_AGG(id) INTO user_ids
    FROM auth.users
    LIMIT 3;
    
    -- 사용자가 있으면 샘플 데이터 삽입
    IF user_ids IS NOT NULL AND array_length(user_ids, 1) > 0 THEN
        -- 첫 번째 사용자 (있으면)
        IF array_length(user_ids, 1) >= 1 THEN
            INSERT INTO public.customers (id, email, name, phone, address, city, postal_code)
            SELECT 
                user_ids[1],
                COALESCE((SELECT email FROM auth.users WHERE id = user_ids[1]), 'kim.customer@example.com'),
                '김고객',
                '010-1234-5678',
                '서울시 강남구 테헤란로 123',
                '서울시',
                '06234'
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                phone = EXCLUDED.phone,
                address = EXCLUDED.address,
                city = EXCLUDED.city,
                postal_code = EXCLUDED.postal_code;
        END IF;
        
        -- 두 번째 사용자 (있으면)
        IF array_length(user_ids, 1) >= 2 THEN
            INSERT INTO public.customers (id, email, name, phone, address, city, postal_code)
            SELECT 
                user_ids[2],
                COALESCE((SELECT email FROM auth.users WHERE id = user_ids[2]), 'lee.customer@example.com'),
                '이고객',
                '010-2345-6789',
                '경기도 성남시 분당구 정자동 456',
                '성남시',
                '13561'
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                phone = EXCLUDED.phone,
                address = EXCLUDED.address,
                city = EXCLUDED.city,
                postal_code = EXCLUDED.postal_code;
        END IF;
        
        -- 세 번째 사용자 (있으면)
        IF array_length(user_ids, 1) >= 3 THEN
            INSERT INTO public.customers (id, email, name, phone, address, city, postal_code)
            SELECT 
                user_ids[3],
                COALESCE((SELECT email FROM auth.users WHERE id = user_ids[3]), 'park.customer@example.com'),
                '박고객',
                '010-3456-7890',
                '부산시 해운대구 해운대해변로 789',
                '부산시',
                '48058'
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                phone = EXCLUDED.phone,
                address = EXCLUDED.address,
                city = EXCLUDED.city,
                postal_code = EXCLUDED.postal_code;
        END IF;
        
        RAISE NOTICE '고객 샘플 데이터가 삽입되었습니다. 사용자 수: %', array_length(user_ids, 1);
    ELSE
        RAISE NOTICE 'auth.users에 사용자가 없어 고객 샘플 데이터를 삽입할 수 없습니다. 먼저 사용자를 생성하세요.';
    END IF;
END $$;

-- 삽입 확인
SELECT COUNT(*) as total_customers FROM public.customers;

-- ==========================================
-- 주문(orders) 샘플 데이터 삽입
-- ==========================================
-- 주의: customer_id는 위에서 삽입한 고객 ID를 사용하고,
-- product_id는 products 테이블에서 삽입된 상품의 UUID를 사용합니다.

-- 첫 번째 주문: 첫 번째 고객이 첫 번째 상품 주문 (고객이 있는 경우에만)
DO $$
DECLARE
    first_customer_id UUID;
    first_product_id UUID;
    order_num TEXT;
    insert_cols TEXT := '';
    select_cols TEXT := '';
    col_name TEXT;
BEGIN
    -- 첫 번째 고객 ID 가져오기
    SELECT id INTO first_customer_id
    FROM public.customers
    ORDER BY created_at
    LIMIT 1;
    
    -- 첫 번째 상품 ID 가져오기
    SELECT id INTO first_product_id
    FROM public.products
    WHERE title = '1950년대 덴마크 티크 사이드보드'
    LIMIT 1;
    
    order_num := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-0001';
    
    -- 고객과 상품이 모두 있으면 주문 삽입
    IF first_customer_id IS NOT NULL AND first_product_id IS NOT NULL THEN
        -- 존재하는 모든 컬럼 확인하여 동적으로 INSERT 문 생성
        FOR col_name IN 
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders'
            AND column_name NOT IN ('id', 'created_at', 'updated_at')  -- 자동 생성 컬럼 제외
            ORDER BY ordinal_position
        LOOP
            IF insert_cols != '' THEN
                insert_cols := insert_cols || ', ';
                select_cols := select_cols || ', ';
            END IF;
            
            insert_cols := insert_cols || col_name;
            
            -- 각 컬럼에 맞는 값 설정
            CASE col_name
                WHEN 'order_number' THEN
                    select_cols := select_cols || quote_literal(order_num);
                WHEN 'user_id' THEN
                    select_cols := select_cols || quote_literal(first_customer_id::TEXT) || '::UUID';
                WHEN 'customer_id' THEN
                    select_cols := select_cols || quote_literal(first_customer_id::TEXT) || '::UUID';
                WHEN 'product_id' THEN
                    select_cols := select_cols || quote_literal(first_product_id::TEXT) || '::UUID';
                WHEN 'product_name' THEN
                    select_cols := select_cols || '(SELECT title FROM public.products WHERE id = ' || quote_literal(first_product_id::TEXT) || '::UUID)';
                WHEN 'quantity' THEN
                    select_cols := select_cols || '1';
                WHEN 'unit_price' THEN
                    select_cols := select_cols || '(SELECT price FROM public.products WHERE id = ' || quote_literal(first_product_id::TEXT) || '::UUID)';
                WHEN 'amount' THEN
                    select_cols := select_cols || '(SELECT price FROM public.products WHERE id = ' || quote_literal(first_product_id::TEXT) || '::UUID)';
                WHEN 'total_amount' THEN
                    select_cols := select_cols || '(SELECT price FROM public.products WHERE id = ' || quote_literal(first_product_id::TEXT) || '::UUID)';
                WHEN 'status' THEN
                    select_cols := select_cols || quote_literal('confirmed');
                WHEN 'payment_method' THEN
                    select_cols := select_cols || quote_literal('신용카드');
                WHEN 'payment_status' THEN
                    select_cols := select_cols || quote_literal('completed');
                WHEN 'payment_key' THEN
                    select_cols := select_cols || 'NULL';
                WHEN 'shipping_address' THEN
                    select_cols := select_cols || 'COALESCE((SELECT address FROM public.customers WHERE id = ' || quote_literal(first_customer_id::TEXT) || '::UUID), ' || quote_literal('서울시 강남구 테헤란로 123') || ')';
                WHEN 'shipping_city' THEN
                    select_cols := select_cols || 'COALESCE((SELECT city FROM public.customers WHERE id = ' || quote_literal(first_customer_id::TEXT) || '::UUID), ' || quote_literal('서울시') || ')';
                WHEN 'shipping_postal_code' THEN
                    select_cols := select_cols || 'COALESCE((SELECT postal_code FROM public.customers WHERE id = ' || quote_literal(first_customer_id::TEXT) || '::UUID), ' || quote_literal('06234') || ')';
                WHEN 'notes' THEN
                    select_cols := select_cols || quote_literal('부재 시 문 앞에 놓아주세요.');
                WHEN 'furniture_id' THEN
                    select_cols := select_cols || 'NULL';
                ELSE
                    -- 알 수 없는 컬럼은 NULL로 설정
                    select_cols := select_cols || 'NULL';
            END CASE;
        END LOOP;
        
        -- 동적 INSERT 실행
        IF insert_cols != '' THEN
            EXECUTE format('
                INSERT INTO public.orders (%s)
                SELECT %s
                WHERE NOT EXISTS (
                    SELECT 1 FROM public.orders 
                    WHERE order_number = %s
                )',
                insert_cols, select_cols, quote_literal(order_num)
            );
        END IF;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '주문 삽입 중 오류 발생: %', SQLERRM;
END $$;

-- 두 번째 주문: 두 번째 고객이 두 번째 상품 주문 (고객이 있는 경우에만)
DO $$
DECLARE
    second_customer_id UUID;
    second_product_id UUID;
    order_num TEXT;
    insert_cols TEXT := '';
    select_cols TEXT := '';
    col_name TEXT;
BEGIN
    -- 두 번째 고객 ID 가져오기
    SELECT id INTO second_customer_id
    FROM public.customers
    ORDER BY created_at
    OFFSET 1
    LIMIT 1;
    
    -- 두 번째 상품 ID 가져오기
    SELECT id INTO second_product_id
    FROM public.products
    WHERE title = '프렌치 프로방스 앤틱 다이닝 테이블'
    LIMIT 1;
    
    order_num := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-0002';
    
    -- 고객과 상품이 모두 있으면 주문 삽입
    IF second_customer_id IS NOT NULL AND second_product_id IS NOT NULL THEN
        -- 존재하는 모든 컬럼 확인하여 동적으로 INSERT 문 생성
        FOR col_name IN 
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders'
            AND column_name NOT IN ('id', 'created_at', 'updated_at')  -- 자동 생성 컬럼 제외
            ORDER BY ordinal_position
        LOOP
            IF insert_cols != '' THEN
                insert_cols := insert_cols || ', ';
                select_cols := select_cols || ', ';
            END IF;
            
            insert_cols := insert_cols || col_name;
            
            -- 각 컬럼에 맞는 값 설정
            CASE col_name
                WHEN 'order_number' THEN
                    select_cols := select_cols || quote_literal(order_num);
                WHEN 'user_id' THEN
                    select_cols := select_cols || quote_literal(second_customer_id::TEXT) || '::UUID';
                WHEN 'customer_id' THEN
                    select_cols := select_cols || quote_literal(second_customer_id::TEXT) || '::UUID';
                WHEN 'product_id' THEN
                    select_cols := select_cols || quote_literal(second_product_id::TEXT) || '::UUID';
                WHEN 'product_name' THEN
                    select_cols := select_cols || '(SELECT title FROM public.products WHERE id = ' || quote_literal(second_product_id::TEXT) || '::UUID)';
                WHEN 'quantity' THEN
                    select_cols := select_cols || '1';
                WHEN 'unit_price' THEN
                    select_cols := select_cols || '(SELECT price FROM public.products WHERE id = ' || quote_literal(second_product_id::TEXT) || '::UUID)';
                WHEN 'amount' THEN
                    select_cols := select_cols || '(SELECT price FROM public.products WHERE id = ' || quote_literal(second_product_id::TEXT) || '::UUID)';
                WHEN 'total_amount' THEN
                    select_cols := select_cols || '(SELECT price FROM public.products WHERE id = ' || quote_literal(second_product_id::TEXT) || '::UUID)';
                WHEN 'status' THEN
                    select_cols := select_cols || quote_literal('processing');
                WHEN 'payment_method' THEN
                    select_cols := select_cols || quote_literal('카카오페이');
                WHEN 'payment_status' THEN
                    select_cols := select_cols || quote_literal('completed');
                WHEN 'payment_key' THEN
                    select_cols := select_cols || 'NULL';
                WHEN 'shipping_address' THEN
                    select_cols := select_cols || 'COALESCE((SELECT address FROM public.customers WHERE id = ' || quote_literal(second_customer_id::TEXT) || '::UUID), ' || quote_literal('경기도 성남시 분당구 정자동 456') || ')';
                WHEN 'shipping_city' THEN
                    select_cols := select_cols || 'COALESCE((SELECT city FROM public.customers WHERE id = ' || quote_literal(second_customer_id::TEXT) || '::UUID), ' || quote_literal('성남시') || ')';
                WHEN 'shipping_postal_code' THEN
                    select_cols := select_cols || 'COALESCE((SELECT postal_code FROM public.customers WHERE id = ' || quote_literal(second_customer_id::TEXT) || '::UUID), ' || quote_literal('13561') || ')';
                WHEN 'notes' THEN
                    select_cols := select_cols || quote_literal('배송 전 연락 부탁드립니다.');
                WHEN 'furniture_id' THEN
                    select_cols := select_cols || 'NULL';
                ELSE
                    -- 알 수 없는 컬럼은 NULL로 설정
                    select_cols := select_cols || 'NULL';
            END CASE;
        END LOOP;
        
        -- 동적 INSERT 실행
        IF insert_cols != '' THEN
            EXECUTE format('
                INSERT INTO public.orders (%s)
                SELECT %s
                WHERE NOT EXISTS (
                    SELECT 1 FROM public.orders 
                    WHERE order_number = %s
                )',
                insert_cols, select_cols, quote_literal(order_num)
            );
        END IF;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '주문 삽입 중 오류 발생: %', SQLERRM;
END $$;

-- 삽입 확인
SELECT 
    o.order_number,
    COALESCE(c.name, '고객 정보 없음') as customer_name,
    COALESCE(p.title, o.product_name, '상품 정보 없음') as product_name,
    COALESCE(o.quantity, 1) as quantity,
    COALESCE(o.total_amount, o.amount, 0) as total_amount,
    o.status,
    o.payment_status
FROM public.orders o
LEFT JOIN public.customers c ON (
    (o.customer_id = c.id) OR 
    (EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'user_id') AND o.user_id = c.id)
)
LEFT JOIN public.products p ON o.product_id = p.id
ORDER BY o.created_at DESC
LIMIT 10;
