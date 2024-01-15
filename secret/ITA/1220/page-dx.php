<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>株式会社アイティ・アシスト</title>
  <link rel="stylesheet" href="https://use.typekit.net/qbw0hdu.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@100&display=swap" rel="stylesheet">
  <?php wp_head(); ?>
</head>

<body>
  <?php get_template_part('includes/header'); ?>
  <section class="p-dx__main-visual d-flex flex-direction-column align-items-center">
    <div class="p-dx__main-visual__wrapper d-flex flex-direction-column align-items-center">
      <div class="p-dx__main-visual__wrapper__header">
        <h2 class="text-white">DX人財育成</h2>
      </div>
      <div class="p-dx__main-visual__wrapper__sub-header">
        <p class="text-white">デジタル技術を駆使してビジネスを変革、新しい価値を生み出すDX(デジタル・トランスフォーメーション)。
        <br>
        アイティ・アシストは、そんなDX人財の定義・育成の流れ・評価方法をクライアントのオーダーに合わせてカスタマイズで作成</p>
      </div>
      <div class="p-dx__main-visual__wrapper__content d-flex justify-content-space-between">
        <div class="p-dx__main-visual__wrapper__content__wrapper">
          <div class="p-dx__main-visual__wrapper__content__wrapper__item gradation"> 
            <span class="triangle"></span>
            <p class="fw-bold">DX人財の定義</p>
          </div> 
        </div>
        <div class="p-dx__main-visual__wrapper__content__wrapper">
          <div class="p-dx__main-visual__wrapper__content__wrapper__item ">
            <span class="triangle"></span>  
            <p class="fw-bold">人財育成の流れ<br>評価方法</p>
          </div> 
        </div>
        <div class="p-dx__main-visual__wrapper__content__wrapper">
          <div class="p-dx__main-visual__wrapper__content__wrapper__item ">
            <span class="triangle"></span>
            <p class="fw-bold">トレーニングコース</p>
          </div> 
        </div> 
      </div>
    </div>
  </section>
  <section class="p-dx__definition">
    <div class="p-dx__definition__wrapper d-flex flex-direction-column align-items-center">
      <div class="p-dx__definition__wrapper__header mb-sm">
        <h2>
          DX人財の定義
        </h2>
        <p>
          前提として必要になる「各ロールの定義・役割」はクライアントごとに打ち合わせを重ねて設定。<br>※既にITスキル要件をまとめている場合は、DXスキル要件をITスキル要件に統合。
        </p>
      </div>
      <div class="p-dx__definition__wrapper__chart">
        <div class="p-dx__definition__wrapper__chart__image"></div>
      </div>
      <div class="p-dx__definition__wrapper__content">
        <table>
          <tr>
            <th>名称</th>
            <th>定義</th>
            <th>役割</th>
          </tr>
          <tr>
            <td><p>ビジネス<br>アーキテクト</p></td>
            <td><p>新規事業立案/既存業務の高速化・効率化を推進する</p></td>  
            <td><p>DXの取組みにおいて、ビジネスや業務の変革を通じて実現したいこと (= 目的) を設定したうえで、関係者をコーディネートし関係者間の協働関係の構築をリードしながら、目的実現に向けたプロセスの一貫した推進を通じて、目的を実現する人財</p></td>  
          </tr>
          <tr>
            <td><p>デザイナー</p></td>
            <td><p>サービスのUXをデザインする</p></td>   
            <td><p>ビジネスの視点、顧客・ユーザーの視点等を総合的にとらえ、製品・サービスの方針や開発のプロセスを策定し、それらに沿った製品・サービスのありかたのデザインを担う人財</p></td>   
          </tr>
          <tr>
            <td><p>データ<br>サイエンティスト</p></td> 
            <td><p>要求に応じてデータ解析を担う</p></td> 
            <td><p>DXの推進において、データを活用した業務改革や新規ビジネスの実現に向けて、データを収集・解析する仕組みの設計・実装・運用を担う人財</p></td> 
          </tr>
          <tr>
            <td><p>ソフトウェア<br>エンジニア</p></td> 
            <td><p>情報システムの構築・運用を担う</p></td> 
            <td><p>DXの推進において、デジタル技術を活用した製品・サービスを提供するためのシステムやソフトウェアの設計・実装・運用を担う人財</p></td> 
          </tr>
          <tr>
            <td><p>サイバー<br>セキュリティ</p></td>
            <td><p>組織のセキュリティの維持向上を担う</p></td>  
            <td><p>業務プロセスを支えるデジタル環境におけるサイバーセキュリティリスクの影響を抑制する対策を担う人財</p></td> 
          </tr>
        </table>
      </div> 
    </div>
  </section>
  <section class="p-dx__flow"></section>
  <section class="p-dx__e-learning"></section>
  <section class="p-dx__training"></section>
  <section class="p-dx__webinar"></section>
  <section class="p-dx__track-record"></section>

  <?php
  the_content();
  ?>

  <?php get_template_part('includes/footer'); ?>
  <?php wp_footer(); ?>
</body>

</html>