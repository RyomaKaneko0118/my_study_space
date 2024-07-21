class TestSurvey
  attr_accessor :is_set_result_password, :result_password
end

survey_params = TestSurvey.new()
survey_params.is_set_result_password = 1

survey_params.result_password = "createPassword" if survey_params.is_set_result_password == 1
survey_params