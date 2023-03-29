package main

import (
	"io/ioutil"
	"log"
	"net/http"
)

func main() {
	resp, err := http.Get("http://abehiroshi.la.coocan.jp")
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}
	log.Println(string(body))
	log.Println(resp)
	log.Println("Status:", resp.Status)
	log.Println("StatusCode", resp.StatusCode)
	log.Println("Headers", resp.Header)
}
