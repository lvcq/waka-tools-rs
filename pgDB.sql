-- 数据库相关初始化脚本


-- 启用插件
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 更新时间触发器

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW(); -- 更新 updated_at 字段为当前时间
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建枚举
CREATE TYPE body_type_enum AS ENUM ('female', 'male', 'girl', 'boy','horse');


-- 创建裁剪器表
CREATE TABLE IF NOT EXISTS cropper_table(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    sample VARCHAR(256),
    start_x INTEGER NOT NULL,
    start_y INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    col_span INTEGER DEFAULT 1,
    thumbnail VARCHAR(256),
    body_type body_type_enum NOT NULL,
    create_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_cropper_updated_at
BEFORE UPDATE ON cropper_table
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE cropper_table IS '裁剪器记录表';
COMMENT ON COLUMN cropper_table.name IS '裁剪器名称'; 
COMMENT ON COLUMN cropper_table.sample IS '示例图片';
COMMENT ON COLUMN cropper_table.start_x IS '裁剪器横轴起点';
COMMENT ON COLUMN cropper_table.start_y is '裁剪器纵轴起点';
COMMENT ON COLUMN cropper_table.width IS '裁剪器宽度';
COMMENT ON COLUMN cropper_table.height IS '裁剪器高度';
COMMENT ON COLUMN cropper_table.col_span IS '裁剪器占用的列数';
COMMENT ON COLUMN cropper_table.thumbnail IS '裁剪缩略图';
COMMENT ON COLUMN cropper_table.body_type IS '适用体型';
