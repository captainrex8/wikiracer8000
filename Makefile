test:
	docker build -t wikiracer8000-test -f Dockerfile.test .
	docker run --rm wikiracer8000-test