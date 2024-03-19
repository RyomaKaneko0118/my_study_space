  # TIGET指定席の座席情報の配列
  def seats_array(prefix = '', suffix = '')
    return seats_str_array if ticket_type.disp_reservation_seats?
    disp_seat_at = ticket_type&.disp_seat_at
    return nil if disp_seat_at.blank? # 座席情報表示日時が存在しない場合
    prefix.empty? ? ["#{I18n.l(disp_seat_at, format: :middle)}#{suffix}"] : ["#{I18n.t("models.audience.seats_array.message", time: "#{I18n.l(disp_seat_at, format: :middle)}")}"]
  end

    # TIGET指定席の座席情報の配列
    def seats_array(prefix = '', suffix = '')
      return seats_str_array if ticket_type.disp_reservation_seats?
      disp_seat_at = ticket_type&.disp_seat_at
      return nil if disp_seat_at.blank? # 座席情報表示日時が存在しない場合
      ["#{prefix}#{I18n.l(disp_seat_at, format: :middle)}#{suffix}"]
    end