# 使用 Ubuntu 24.04 基础镜像
FROM ubuntu:24.04

# 安装依赖
RUN apt update && \
    apt install -y libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    unzip \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

# 安装 Rust, Bun
RUN curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh -s -- -y
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="/root/.bun"
ENV PATH="${BUN_INSTALL}/bin:/root/.cargo/bin:${PATH}"