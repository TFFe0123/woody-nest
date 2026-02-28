    -- 상품, 고객, 주문 테이블 생성
    -- Supabase 대시보드의 SQL Editor에서 실행하세요

    -- ==========================================
    -- 1. 상품(products) 테이블 생성
    -- ==========================================

    CREATE TABLE IF NOT EXISTS public.products (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        price BIGINT NOT NULL CHECK (price > 0),
        location TEXT NOT NULL,
        image TEXT NOT NULL,
        material TEXT NOT NULL,
        dimensions TEXT NOT NULL,
        condition TEXT NOT NULL CHECK (condition IN ('최상', '상', '중', '하')),
        style TEXT,
        description TEXT,
        stock INTEGER DEFAULT 1 CHECK (stock >= 0),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- RLS (Row Level Security) 활성화
    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

    -- 정책 생성: 모든 사용자가 상품 목록 조회 가능 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE POLICY "Anyone can view products"
            ON public.products
            FOR SELECT
            USING (is_active = true);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- 정책 생성: 관리자만 상품 등록/수정/삭제 가능 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE POLICY "Authenticated users can insert products"
            ON public.products
            FOR INSERT
            TO authenticated
            WITH CHECK (true);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
        CREATE POLICY "Authenticated users can update products"
            ON public.products
            FOR UPDATE
            TO authenticated
            USING (true)
            WITH CHECK (true);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
        CREATE POLICY "Authenticated users can delete products"
            ON public.products
            FOR DELETE
            TO authenticated
            USING (true);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- 인덱스 생성
    CREATE INDEX IF NOT EXISTS products_style_idx ON public.products(style);
    CREATE INDEX IF NOT EXISTS products_material_idx ON public.products(material);
    CREATE INDEX IF NOT EXISTS products_condition_idx ON public.products(condition);
    CREATE INDEX IF NOT EXISTS products_price_idx ON public.products(price);
    CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products(created_at DESC);
    CREATE INDEX IF NOT EXISTS products_is_active_idx ON public.products(is_active);

    -- ==========================================
    -- 2. 고객(customers) 테이블 생성
    -- ==========================================

    CREATE TABLE IF NOT EXISTS public.customers (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        name TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        postal_code TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- RLS (Row Level Security) 활성화
    ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

    -- 정책 생성: 사용자는 자신의 정보만 조회 가능 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE POLICY "Users can view their own profile"
            ON public.customers
            FOR SELECT
            USING (auth.uid() = id);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- 정책 생성: 사용자는 자신의 정보만 생성 가능 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE POLICY "Users can insert their own profile"
            ON public.customers
            FOR INSERT
            WITH CHECK (auth.uid() = id);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- 정책 생성: 사용자는 자신의 정보만 수정 가능 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE POLICY "Users can update their own profile"
            ON public.customers
            FOR UPDATE
            USING (auth.uid() = id)
            WITH CHECK (auth.uid() = id);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- 인덱스 생성
    CREATE INDEX IF NOT EXISTS customers_email_idx ON public.customers(email);

    -- ==========================================
    -- 3. 주문(orders) 테이블 생성
    -- ==========================================

    CREATE TABLE IF NOT EXISTS public.orders (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        order_number TEXT UNIQUE NOT NULL,
        customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
        product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
        quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
        unit_price BIGINT NOT NULL CHECK (unit_price > 0),
        total_amount BIGINT NOT NULL CHECK (total_amount > 0),
        status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
        payment_method TEXT,
        payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
        shipping_address TEXT,
        shipping_city TEXT,
        shipping_postal_code TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- 필요한 컬럼이 없으면 추가 (기존 테이블 호환)
    DO $$
    BEGIN
        -- customer_id 컬럼 추가
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'customer_id'
        ) THEN
            ALTER TABLE public.orders 
            ADD COLUMN customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE;
        END IF;
        
        -- order_number 컬럼 추가 (기존 테이블이 order_id를 사용하는 경우)
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'order_number'
        ) THEN
            -- order_id가 있으면 order_number로 이름 변경, 없으면 새로 추가
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'orders' 
                AND column_name = 'order_id'
            ) THEN
                ALTER TABLE public.orders 
                RENAME COLUMN order_id TO order_number;
            ELSE
                ALTER TABLE public.orders 
                ADD COLUMN order_number TEXT UNIQUE;
            END IF;
        END IF;
        
        -- product_id 컬럼 추가 (없는 경우)
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'product_id'
        ) THEN
            ALTER TABLE public.orders 
            ADD COLUMN product_id UUID REFERENCES public.products(id) ON DELETE SET NULL;
        END IF;
        
        -- quantity, unit_price, total_amount 컬럼 추가 (없는 경우)
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'quantity'
        ) THEN
            ALTER TABLE public.orders 
            ADD COLUMN quantity INTEGER DEFAULT 1 CHECK (quantity > 0);
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'unit_price'
        ) THEN
            ALTER TABLE public.orders 
            ADD COLUMN unit_price BIGINT CHECK (unit_price > 0);
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'total_amount'
        ) THEN
            ALTER TABLE public.orders 
            ADD COLUMN total_amount BIGINT CHECK (total_amount > 0);
        END IF;
        
        -- shipping 관련 컬럼 추가 (없는 경우)
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'shipping_address'
        ) THEN
            ALTER TABLE public.orders 
            ADD COLUMN shipping_address TEXT;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'shipping_city'
        ) THEN
            ALTER TABLE public.orders 
            ADD COLUMN shipping_city TEXT;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'shipping_postal_code'
        ) THEN
            ALTER TABLE public.orders 
            ADD COLUMN shipping_postal_code TEXT;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'notes'
        ) THEN
            ALTER TABLE public.orders 
            ADD COLUMN notes TEXT;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'payment_status'
        ) THEN
            ALTER TABLE public.orders 
            ADD COLUMN payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded'));
        END IF;
        
        -- payment_method 컬럼 추가 (없는 경우)
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'payment_method'
        ) THEN
            ALTER TABLE public.orders 
            ADD COLUMN payment_method TEXT;
        END IF;
END $$;

    -- RLS (Row Level Security) 활성화
    ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

    -- 정책 생성: 사용자는 자신의 주문만 조회 가능 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE POLICY "Users can view their own orders"
            ON public.orders
            FOR SELECT
            USING (auth.uid() = customer_id);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- 정책 생성: 사용자는 자신의 주문만 생성 가능 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE POLICY "Users can insert their own orders"
            ON public.orders
            FOR INSERT
            WITH CHECK (auth.uid() = customer_id);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- 정책 생성: 사용자는 자신의 주문만 수정 가능 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE POLICY "Users can update their own orders"
            ON public.orders
            FOR UPDATE
            USING (auth.uid() = customer_id)
            WITH CHECK (auth.uid() = customer_id);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- 인덱스 생성
    CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON public.orders(customer_id);
    CREATE INDEX IF NOT EXISTS orders_product_id_idx ON public.orders(product_id);
    CREATE INDEX IF NOT EXISTS orders_order_number_idx ON public.orders(order_number);
    CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);
    CREATE INDEX IF NOT EXISTS orders_payment_status_idx ON public.orders(payment_status);
    CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);

    -- ==========================================
    -- 트리거 함수: updated_at 자동 업데이트
    -- ==========================================

    -- updated_at 자동 업데이트 함수
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- 각 테이블에 트리거 적용 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
        CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
        CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- ==========================================
    -- 주문번호 생성 함수
    -- ==========================================

    CREATE OR REPLACE FUNCTION generate_order_number()
    RETURNS TEXT AS $$
    DECLARE
        new_order_number TEXT;
        order_count BIGINT;
    BEGIN
        -- 날짜 기반 주문번호 생성 (예: ORD-20240101-0001)
        SELECT COUNT(*) + 1 INTO order_count
        FROM public.orders
        WHERE DATE(created_at) = CURRENT_DATE;
        
        new_order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(order_count::TEXT, 4, '0');
        
        RETURN new_order_number;
    END;
    $$ LANGUAGE plpgsql;

    -- ==========================================
    -- 4. 결제(payments) 테이블 생성
    -- ==========================================

    CREATE TABLE IF NOT EXISTS public.payments (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
        product_name TEXT NOT NULL,
        amount BIGINT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'cancelled')),
        payment_method TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- RLS (Row Level Security) 활성화
    ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

    -- 정책 생성: 사용자는 자신의 결제내역만 조회 가능 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE POLICY "Users can view their own payments"
            ON public.payments
            FOR SELECT
            USING (auth.uid() = user_id);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- 정책 생성: 사용자는 자신의 결제내역만 생성 가능 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE POLICY "Users can insert their own payments"
            ON public.payments
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- 인덱스 생성
    CREATE INDEX IF NOT EXISTS payments_user_id_idx ON public.payments(user_id);
    CREATE INDEX IF NOT EXISTS payments_created_at_idx ON public.payments(created_at DESC);

    -- 트리거 적용 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- ==========================================
    -- 5. 가구(furniture) 테이블 생성
    -- ==========================================

    CREATE TABLE IF NOT EXISTS public.furniture (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
        title TEXT NOT NULL,
        price BIGINT NOT NULL,
        location TEXT NOT NULL,
        image TEXT NOT NULL,
        material TEXT NOT NULL,
        dimensions TEXT NOT NULL,
        condition TEXT NOT NULL CHECK (condition IN ('최상', '상', '중', '하')),
        style TEXT,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- RLS (Row Level Security) 활성화
    ALTER TABLE public.furniture ENABLE ROW LEVEL SECURITY;

    -- 정책 생성: 모든 사용자가 가구 목록 조회 가능 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE POLICY "Anyone can view furniture"
            ON public.furniture
            FOR SELECT
            USING (true);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- 정책 생성: 로그인한 회원만 가구 등록 가능 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE POLICY "Authenticated users can insert furniture"
            ON public.furniture
            FOR INSERT
            TO authenticated
            WITH CHECK (true);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- 정책 생성: 사용자는 자신의 가구만 수정 가능 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE POLICY "Users can update their own furniture"
            ON public.furniture
            FOR UPDATE
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- 정책 생성: 사용자는 자신의 가구만 삭제 가능 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE POLICY "Users can delete their own furniture"
            ON public.furniture
            FOR DELETE
            USING (auth.uid() = user_id);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- 인덱스 생성
    CREATE INDEX IF NOT EXISTS furniture_user_id_idx ON public.furniture(user_id);
    CREATE INDEX IF NOT EXISTS furniture_created_at_idx ON public.furniture(created_at DESC);

    -- 트리거 적용 (이미 존재하면 예외 무시)
    DO $$
    BEGIN
        CREATE TRIGGER update_furniture_updated_at BEFORE UPDATE ON public.furniture
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- 완료! 이제 상품, 고객, 주문, 결제, 가구 테이블을 사용할 수 있습니다.
