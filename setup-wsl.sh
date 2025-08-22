Error: ERROR: 42702: column reference "chunk_index" is ambiguous DETAIL: It could refer to either a PL/pgSQL variable or a table column. QUERY: INSERT INTO public.rag_chunks ( document_id, content, chunk_index, embedding_vector ) VALUES ( p_document_id, v_chunk, v_chunk_index, generate_test_vector(384) ) RETURNING id, document_id, chunk_index, content, (embedding_vector IS NOT NULL) CONTEXT: PL/pgSQL function chunk_and_vectorize_document(uuid,integer,integer) line 40 at SQL statement#!/bin/bash

# Update package lists
sudo apt update

# Install essential development tools
sudo apt install -y \
    build-essential \
    curl \
    git \
    nodejs \
    npm \
    python3 \
    python3-pip \
    docker.io \
    docker-compose \
    postgresql \
    postgresql-contrib

# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Add nvm to bashrc
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc

# Source bashrc to load nvm
source ~/.bashrc

# Install latest LTS Node.js
nvm install --lts

# Install global npm packages
npm install -g yarn
npm install -g typescript
npm install -g @supabase/cli

# Start and enable PostgreSQL
sudo service postgresql start
sudo systemctl enable postgresql

# Create a PostgreSQL user and database
sudo -u postgres psql -c "CREATE USER $USER WITH SUPERUSER PASSWORD 'password';"
sudo -u postgres psql -c "CREATE DATABASE $USER;"

# Add Docker to user group
sudo usermod -aG docker $USER

echo "WSL development environment setup complete!"
echo "Please restart your WSL terminal to apply all changes." 