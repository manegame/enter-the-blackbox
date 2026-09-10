.PHONY: setup tracking tracking-ml runner validate-content import-content test test-runner test-tracking

PYTHON ?= python3
RUNNER_DIR := apps/runner
TRACKER_DIR := services/trackingbox
RUNNER_VENV := $(RUNNER_DIR)/.venv
TRACKER_VENV := $(TRACKER_DIR)/.venv
RUNNER_READY := $(RUNNER_VENV)/.blackbox-ready
TRACKER_READY := $(TRACKER_VENV)/.blackbox-ready
TRACKER_CONFIG ?= $(RUNNER_DIR)/dev/trackingbox.config.json
TRACKER_PORT ?= 8000
RUNNER_PORT ?= 8100

setup: $(RUNNER_READY) $(TRACKER_READY)

$(RUNNER_READY): $(RUNNER_DIR)/pyproject.toml
	@$(PYTHON) -c 'import sys; sys.exit(0 if sys.version_info >= (3, 11) else "Python 3.11+ required; run: pyenv install 3.11.13")'
	$(PYTHON) -m venv --clear $(RUNNER_VENV)
	$(RUNNER_VENV)/bin/pip install --upgrade pip -q
	$(RUNNER_VENV)/bin/pip install -e "$(RUNNER_DIR)[dev]" -q
	@touch $(RUNNER_READY)

$(TRACKER_READY): $(TRACKER_DIR)/pyproject.toml
	@$(PYTHON) -c 'import sys; sys.exit(0 if sys.version_info >= (3, 11) else "Python 3.11+ required; run: pyenv install 3.11.13")'
	$(PYTHON) -m venv --clear $(TRACKER_VENV)
	$(TRACKER_VENV)/bin/pip install --upgrade pip -q
	$(TRACKER_VENV)/bin/pip install -e "$(TRACKER_DIR)[dev]" -q
	@touch $(TRACKER_READY)

# Synthetic tracking with all show zones. Override TRACKER_CONFIG with the
# calibrated venue config for a real performance.
tracking: $(TRACKER_READY)
	cd $(TRACKER_DIR) && "$(CURDIR)/$(TRACKER_VENV)/bin/audience-tracker" serve --config "$(abspath $(TRACKER_CONFIG))" --port $(TRACKER_PORT)

# Install the heavy detection/ReID dependencies needed by a real camera setup.
tracking-ml: $(TRACKER_READY)
	$(TRACKER_VENV)/bin/pip install -e "$(TRACKER_DIR)[ml]"

runner: $(RUNNER_READY)
	cd $(RUNNER_DIR) && "$(CURDIR)/$(RUNNER_VENV)/bin/python" -m uvicorn server.app:app --host 0.0.0.0 --port $(RUNNER_PORT)

validate-content: $(RUNNER_READY)
	cd $(RUNNER_DIR) && "$(CURDIR)/$(RUNNER_VENV)/bin/python" scripts/validate_content.py

import-content: $(RUNNER_READY)
	cd $(RUNNER_DIR) && "$(CURDIR)/$(RUNNER_VENV)/bin/python" scripts/import_content.py $(ARGS)

test-runner: $(RUNNER_READY)
	cd $(RUNNER_DIR) && "$(CURDIR)/$(RUNNER_VENV)/bin/python" -m pytest -q

test-tracking: $(TRACKER_READY)
	cd $(TRACKER_DIR) && "$(CURDIR)/$(TRACKER_VENV)/bin/python" -m pytest -q

test: test-runner test-tracking
