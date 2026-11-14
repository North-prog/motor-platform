-- Motorcycle catalogue: scooter-first Iranian market pilot.
-- A model can be discovered by manufacturer OR by its visual/family category.
ALTER TABLE motorcycle_models ADD COLUMN style_family TEXT;
ALTER TABLE motorcycle_models ADD COLUMN body_type TEXT NOT NULL DEFAULT 'scooter';
ALTER TABLE motorcycle_models ADD COLUMN catalog_priority INTEGER NOT NULL DEFAULT 100;

CREATE INDEX idx_motorcycle_models_style_family ON motorcycle_models(style_family, is_active);
CREATE INDEX idx_motorcycle_models_body_priority ON motorcycle_models(body_type, catalog_priority, is_active);

INSERT OR IGNORE INTO motorcycle_brands (id, name_fa, name_en, slug) VALUES
('brand-honda','هوندا','Honda','honda'),
('brand-kavir','کویر موتور','Kavir','kavir'),
('brand-niroo-galaxy','نیرو موتور / گلکسی','Niroo Motor / Galaxy','niroo-galaxy'),
('brand-kabir','کبیر موتور','Kabir','kabir'),
('brand-dino','دینو','Dino','dino'),
('brand-hamtaz','همتاز','Hamtaz','hamtaz'),
('brand-blenta','بلنتا','Blenta','blenta'),
('brand-tvs','تی‌وی‌اس','TVS','tvs'),
('brand-yamaha','یاماها','Yamaha','yamaha'),
('brand-daichi','دایچی','Daichi','daichi');

INSERT OR IGNORE INTO motorcycle_models
(id, brand_id, name_fa, name_en, engine_cc, style_family, body_type, catalog_priority) VALUES
('model-honda-click160','brand-honda','کلیک ۱۶۰','Click 160',160,'click-style','scooter',10),
('model-honda-pcx160','brand-honda','پی‌سی‌ایکس ۱۶۰','PCX 160',160,'maxi-scooter','scooter',30),
('model-honda-adv160','brand-honda','ای‌دی‌وی ۱۶۰','ADV 160',160,'adventure-scooter','scooter',35),
('model-honda-sh150i','brand-honda','اس‌اچ ۱۵۰ آی','SH150i',150,'classic-scooter','scooter',60),
('model-kavir-s2-150','brand-kavir','اس ۲ ۱۵۰','S2 150',150,'click-style','scooter',5),
('model-kavir-s2-170','brand-kavir','اس ۲ ۱۷۰','S2 170',170,'click-style','scooter',6),
('model-kavir-s5-150','brand-kavir','اس ۵ ۱۵۰','S5 150',150,'classic-scooter','scooter',40),
('model-kavir-s7-150','brand-kavir','اس ۷ ۱۵۰','S7 150',150,'click-style','scooter',12),
('model-kavir-s7-170','brand-kavir','اس ۷ ۱۷۰','S7 170',170,'click-style','scooter',13),
('model-kavir-str160','brand-kavir','اس‌تی‌آر ۱۶۰','STR 160',160,'sport-scooter','scooter',55),
('model-galaxy-cl150','brand-niroo-galaxy','سی‌ال ۱۵۰','CL150',150,'click-style','scooter',7),
('model-galaxy-cx180','brand-niroo-galaxy','سی‌ایکس ۱۸۰','CX180',180,'sport-scooter','scooter',45),
('model-galaxy-sr200','brand-niroo-galaxy','اس‌آر ۲۰۰','SR200',200,'sport-scooter','scooter',50),
('model-galaxy-r155','brand-niroo-galaxy','آر ۱۵۵','R155',155,'sport-scooter','scooter',65),
('model-galaxy-x125','brand-niroo-galaxy','ایکس ۱۲۵','X125',125,'city-scooter','scooter',70),
('model-galaxy-jt200','brand-niroo-galaxy','جی‌تی ۲۰۰','JT200',200,'sport-scooter','scooter',75),
('model-galaxy-nh180','brand-niroo-galaxy','ان‌اچ ۱۸۰','NH180',180,'sport-scooter','scooter',80),
('model-galaxy-adv175','brand-niroo-galaxy','ای‌دی‌وی ۱۷۵ هاسکی','ADV175 Husky',175,'adventure-scooter','scooter',38),
('model-kabir-click170','brand-kabir','کلیک ۱۷۰','Click 170',170,'click-style','scooter',14),
('model-dino-click-plus','brand-dino','دینو کلیک پلاس','Dino Click Plus',150,'click-style','scooter',15),
('model-hamtaz-rs150','brand-hamtaz','آر‌اس ۱۵۰','RS150',150,'classic-scooter','scooter',42),
('model-hamtaz-rs150-abs','brand-hamtaz','آر‌اس ۱۵۰ ای‌بی‌اس','RS150 ABS',150,'classic-scooter','scooter',43),
('model-hamtaz-adv150','brand-hamtaz','ای‌دی‌وی ۱۵۰','ADV150',150,'adventure-scooter','scooter',44),
('model-hamtaz-sh200','brand-hamtaz','اس‌اچ ۲۰۰','SH200',200,'classic-scooter','scooter',46),
('model-blenta-click-v150','brand-blenta','کلیک وی ۱۵۰','Click V150',150,'click-style','scooter',16),
('model-blenta-click-vr150','brand-blenta','کلیک وی‌آر ۱۵۰','Click VR150',150,'click-style','scooter',17),
('model-blenta-vlx150','brand-blenta','وی‌ال‌ایکس ۱۵۰','VLX150',150,'classic-scooter','scooter',48),
('model-tvs-ntorq125','brand-tvs','ان‌تورک ۱۲۵','Ntorq 125',125,'sport-scooter','scooter',25),
('model-yamaha-nmax155','brand-yamaha','ان‌مکس ۱۵۵','NMAX 155',155,'maxi-scooter','scooter',20),
('model-yamaha-aerox155','brand-yamaha','ایروکس ۱۵۵','Aerox 155',155,'sport-scooter','scooter',22),
('model-daichi-bx200','brand-daichi','بی‌ایکس ۲۰۰','BX200',200,'sport-scooter','scooter',52);

INSERT OR IGNORE INTO motorcycle_variants (id, model_id, name_fa, name_en, generation)
SELECT 'variant-' || id, id, 'نسخه پایه', 'Standard', 'نامشخص'
FROM motorcycle_models
WHERE id IN (
'model-honda-click160','model-honda-pcx160','model-honda-adv160','model-honda-sh150i',
'model-kavir-s2-150','model-kavir-s2-170','model-kavir-s5-150','model-kavir-s7-150','model-kavir-s7-170','model-kavir-str160',
'model-galaxy-cl150','model-galaxy-cx180','model-galaxy-sr200','model-galaxy-r155','model-galaxy-x125','model-galaxy-jt200','model-galaxy-nh180','model-galaxy-adv175',
'model-kabir-click170','model-dino-click-plus','model-hamtaz-rs150','model-hamtaz-rs150-abs','model-hamtaz-adv150','model-hamtaz-sh200',
'model-blenta-click-v150','model-blenta-click-vr150','model-blenta-vlx150','model-tvs-ntorq125','model-yamaha-nmax155','model-yamaha-aerox155','model-daichi-bx200'
);
