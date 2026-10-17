CREATE TABLE IF NOT EXISTS policies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    standard_type TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    publish_date TEXT NOT NULL,
    summary_core TEXT,
    target_entities TEXT,
    cpa_takeaways TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_policies_publish_date ON policies(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_policies_standard_type ON policies(standard_type);
