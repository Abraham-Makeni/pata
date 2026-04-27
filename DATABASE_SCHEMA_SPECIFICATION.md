# PATA Database Schema Specification

## Overview
This document provides comprehensive database schema specifications for the PATA service discovery and booking platform. The database will support user authentication, provider management, booking system, chat functionality, and review system.

## Database Technology
- **Primary:** PostgreSQL 14+
- **Redis:** For caching and session management
- **Elasticsearch:** For provider search and indexing (optional)

## Schema Design

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### Providers Table
```sql
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    emoji VARCHAR(10),
    image_url VARCHAR(500) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES categories(id),
    location VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    about TEXT,
    starting_price DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    booked_count INTEGER DEFAULT 0,
    repeat_clients INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    verification_document_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_providers_category_id ON providers(category_id);
CREATE INDEX idx_providers_location ON providers(location);
CREATE INDEX idx_providers_rating ON providers(rating DESC);
CREATE INDEX idx_providers_verified ON providers(is_verified);
CREATE INDEX idx_providers_featured ON providers(is_featured);
CREATE INDEX idx_providers_active ON providers(is_active);
CREATE INDEX idx_providers_slug ON providers(slug);
CREATE INDEX idx_providers_search ON providers USING gin(to_tsvector('english', name || ' ' || specialty || ' ' || about));
```

### Categories Table
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    emoji VARCHAR(10),
    description TEXT,
    icon_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_sort ON categories(sort_order);
```

### Provider Services Table
```sql
CREATE TABLE provider_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_provider_services_provider_id ON provider_services(provider_id);
CREATE INDEX idx_provider_services_active ON provider_services(is_active);
CREATE INDEX idx_provider_services_sort ON provider_services(sort_order);
```

### Provider Gallery Table
```sql
CREATE TABLE provider_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_provider_gallery_provider_id ON provider_gallery(provider_id);
CREATE INDEX idx_provider_gallery_sort ON provider_gallery(sort_order);
CREATE INDEX idx_provider_gallery_active ON provider_gallery(is_active);
```

### Provider Tags Table
```sql
CREATE TABLE provider_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_provider_tags_provider_id ON provider_tags(provider_id);
CREATE INDEX idx_provider_tags_tag ON provider_tags(tag);
CREATE UNIQUE INDEX idx_provider_tags_unique ON provider_tags(provider_id, tag);
```

### Bookings Table
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    service_price VARCHAR(50) NOT NULL,
    service_duration VARCHAR(50) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_bookings_date_time ON bookings(booking_date, booking_time);
```

### Reviews Table
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT,
    would_recommend BOOLEAN DEFAULT FALSE,
    response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, provider_id) -- One review per user per provider
);

-- Indexes
CREATE INDEX idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_visible ON reviews(is_visible);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
```

### Review Tags Table
```sql
CREATE TABLE review_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_review_tags_review_id ON review_tags(review_id);
CREATE INDEX idx_review_tags_tag ON review_tags(tag);
CREATE UNIQUE INDEX idx_review_tags_unique ON review_tags(review_id, tag);
```

### Chat Conversations Table
```sql
CREATE TABLE chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    last_message_at TIMESTAMP WITH TIME ZONE,
    last_message_preview TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, provider_id)
);

-- Indexes
CREATE INDEX idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX idx_chat_conversations_provider_id ON chat_conversations(provider_id);
CREATE INDEX idx_chat_conversations_last_message ON chat_conversations(last_message_at DESC);
CREATE INDEX idx_chat_conversations_active ON chat_conversations(is_active);
```

### Chat Messages Table
```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'provider')),
    sender_id UUID NOT NULL,
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_chat_messages_conversation_id ON chat_conversation_id;
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_type, sender_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_chat_messages_unread ON chat_messages(is_read, created_at) WHERE is_read = FALSE;
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);
```

### Notification Settings Table
```sql
CREATE TABLE notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    booking_reminders BOOLEAN DEFAULT TRUE,
    new_messages BOOLEAN DEFAULT TRUE,
    promotional_emails BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_notification_settings_user_id ON notification_settings(user_id);
```

### Audit Log Table
```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
```

## Views

### Provider Statistics View
```sql
CREATE VIEW provider_stats AS
SELECT 
    p.id,
    p.name,
    p.rating,
    p.review_count,
    p.total_bookings,
    p.booked_count,
    p.repeat_clients,
    COUNT(DISTINCT b.user_id) as unique_clients,
    COUNT(DISTINCT CASE WHEN b.status = 'completed' THEN b.user_id END) as completed_clients,
    AVG(CASE WHEN r.rating IS NOT NULL THEN r.rating END) as avg_rating,
    COUNT(r.id) as total_reviews,
    COUNT(CASE WHEN r.would_recommend = TRUE THEN 1 END) as would_recommend_count
FROM providers p
LEFT JOIN bookings b ON p.id = b.provider_id
LEFT JOIN reviews r ON p.id = r.provider_id
GROUP BY p.id, p.name, p.rating, p.review_count, p.total_bookings, p.booked_count, p.repeat_clients;
```

### User Statistics View
```sql
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    COUNT(b.id) as total_bookings,
    COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
    COUNT(DISTINCT b.provider_id) as unique_providers,
    COUNT(r.id) as total_reviews,
    AVG(CASE WHEN r.rating IS NOT NULL THEN r.rating END) as avg_rating_given,
    MAX(b.created_at) as last_booking_date
FROM users u
LEFT JOIN bookings b ON u.id = b.user_id
LEFT JOIN reviews r ON u.id = r.user_id
GROUP BY u.id, u.first_name, u.last_name, u.email;
```

## Triggers and Functions

### Update Provider Statistics Trigger
```sql
CREATE OR REPLACE FUNCTION update_provider_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE providers SET
            review_count = (
                SELECT COUNT(*) FROM reviews WHERE provider_id = NEW.id AND is_visible = TRUE
            ),
            rating = COALESCE((
                SELECT AVG(rating) FROM reviews WHERE provider_id = NEW.id AND is_visible = TRUE
            ), 0),
            total_bookings = (
                SELECT COUNT(*) FROM bookings WHERE provider_id = NEW.id
            ),
            booked_count = (
                SELECT COUNT(*) FROM bookings WHERE provider_id = NEW.id AND booking_date >= CURRENT_DATE - INTERVAL '30 days'
            ),
            repeat_clients = (
                SELECT COUNT(DISTINCT b1.user_id) 
                FROM bookings b1 
                WHERE b1.provider_id = NEW.id 
                AND EXISTS (
                    SELECT 1 FROM bookings b2 
                    WHERE b2.provider_id = NEW.id 
                    AND b2.user_id = b1.user_id 
                    AND b2.id != b1.id
                )
            )
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_provider_stats
    AFTER INSERT OR UPDATE ON providers
    FOR EACH ROW EXECUTE FUNCTION update_provider_stats();

CREATE TRIGGER trigger_update_provider_stats_booking
    AFTER INSERT OR UPDATE OR DELETE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_provider_stats();

CREATE TRIGGER trigger_update_provider_stats_review
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_provider_stats();
```

### Update Last Message Trigger
```sql
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_conversations SET
        last_message_at = NEW.created_at,
        last_message_preview = LEFT(NEW.text, 100),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_last_message
    AFTER INSERT ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();
```

## Data Seeding

### Categories Seed Data
```sql
INSERT INTO categories (id, name, slug, emoji, description, sort_order) VALUES
('cat_001', 'Barbers', 'barbers', '✂️', 'Hair cuts, shaves, and grooming services', 1),
('cat_002', 'Hair Stylists', 'hair-stylists', '💇', 'Styling, treatments, and coloring', 2),
('cat_003', 'Nail Techs', 'nail-techs', '💅', 'Gel, art and acrylics', 3),
('cat_004', 'Makeup Artists', 'makeup-artists', '🎨', 'Bridal, glam and editorial', 4),
('cat_005', 'Photographers', 'photographers', '📸', 'Portrait, events and content', 5),
('cat_006', 'Tattoo Artists', 'tattoo-artists', '🎭', 'Custom ink and fine line', 6);
```

## Performance Optimizations

### Partitioning
```sql
-- Partition bookings table by year for better performance
CREATE TABLE bookings_y2024 PARTITION OF bookings
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE bookings_y2025 PARTITION OF bookings
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

### Materialized Views
```sql
CREATE MATERIALIZED VIEW trending_providers AS
SELECT 
    p.*,
    (p.rating * p.booked_count) as trending_score
FROM providers p
WHERE p.is_active = TRUE 
AND p.is_verified = TRUE 
AND p.rating >= 4.5
ORDER BY trending_score DESC
LIMIT 10;

-- Refresh every hour
CREATE OR REPLACE FUNCTION refresh_trending_providers()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY trending_providers;
END;
$$ LANGUAGE plpgsql;
```

## Backup Strategy

### Daily Backup
```bash
# Full database backup
pg_dump -h localhost -U postgres -d pata_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Schema only backup
pg_dump -h localhost -U postgres -d pata_db --schema-only > schema_$(date +%Y%m%d_%H%M%S).sql
```

### Point-in-Time Recovery
Configure WAL archiving for point-in-time recovery:
```sql
-- In postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /backup/archive/%f'
```

## Security Considerations

### Row Level Security
```sql
-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for bookings
CREATE POLICY booking_user_policy ON bookings
    FOR ALL TO authenticated_users
    USING (user_id = current_setting('app.current_user_id')::UUID);

-- Policies for chat messages
CREATE POLICY chat_message_policy ON chat_messages
    FOR ALL TO authenticated_users
    USING (
        conversation_id IN (
            SELECT id FROM chat_conversations 
            WHERE user_id = current_setting('app.current_user_id')::UUID
        )
    );
```

### Data Encryption
- Encrypt sensitive data at rest using PostgreSQL encryption
- Use TLS for all database connections
- Hash passwords using bcrypt with cost factor 12
- Store PII in encrypted columns where required

## Monitoring and Maintenance

### Performance Monitoring
```sql
-- Slow query log
ALTER SYSTEM SET log_min_duration_statement = 1000;
ALTER SYSTEM SET log_statement = 'all';

-- Connection monitoring
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

### Maintenance Tasks
```sql
-- Update statistics
ANALYZE;

-- Reindex fragmented indexes
REINDEX DATABASE pata_db;

-- Vacuum analyze tables
VACUUM ANALYZE providers;
VACUUM ANALYZE bookings;
VACUUM ANALYZE chat_messages;
```

## Scaling Considerations

### Read Replicas
- Set up read replicas for reporting and analytics
- Use connection pooling with PgBouncer
- Implement caching layer with Redis for frequently accessed data

### Database Sharding
- Consider sharding by region if expanding beyond Nairobi
- Use provider_id as sharding key for bookings and reviews
- Implement consistent hashing for chat messages distribution

## Data Retention Policy

### Chat Messages
- Archive messages older than 6 months to cold storage
- Delete messages older than 2 years (unless legally required)

### Audit Logs
- Keep audit logs for 1 year in primary database
- Archive older logs to long-term storage

### Booking Records
- Keep completed booking records for 7 years
- Archive cancelled bookings after 2 years

## Environment Configuration

### Development Environment
```sql
-- Development database
CREATE DATABASE pata_dev;
CREATE USER pata_dev WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE pata_dev TO pata_dev;
```

### Production Environment
```sql
-- Production database with proper permissions
CREATE DATABASE pata_prod;
CREATE USER pata_app WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE pata_prod TO pata_app;
GRANT USAGE ON SCHEMA public TO pata_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO pata_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO pata_app;
```

## Migration Strategy

### Version Control
- Use database migration tool (Flyway or Liquibase)
- Version all schema changes
- Include rollback scripts for each migration

### Migration Process
1. Test migrations on staging environment
2. Create backup before production migration
3. Run migrations during maintenance window
4. Verify data integrity post-migration
5. Monitor performance after migration
